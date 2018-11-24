import "reflect-metadata";
import * as express from "express";
import * as glue from "schemaglue";
import { createConnection } from "typeorm";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import * as session from "express-session";
import { redis } from "./redis";
import * as Store from "connect-redis";
import { EMAIL_CONFIRM_PREFIX, REDIS_RATE_LIMIT_PREFIX } from "./constants";
import { User } from "./entity/User";
import * as dotenv from "dotenv";
dotenv.config();
import * as rateLimit from "express-rate-limit";
// import * as slowDown from "express-slow-down";
import * as RateRedisStore from "rate-limit-redis";

const RedisStore = Store(session);
const app = express();

const { schema, resolver } = glue("src/modules", { mode: "ts" });

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver
});

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req }: any) => ({
    req,
    redis,
    url: req.protocol + "://" + req.get("host") // to get the host url eg: localhost:4000
  })
});

// this should not go about Apollo server
app.use(
  session({
    store: new RedisStore({ client: redis as any }),
    secret: "typescript graphql server ",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false }
  })
);

// email confirmation route
app.get("/confirm/:id", async (req, res) => {
  const { id } = req.params;
  const userId = await redis.get(`${EMAIL_CONFIRM_PREFIX}${id}`);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    res.send("ok");
  } else {
    res.send("invalid");
  }
});

const limiter = new rateLimit({
  store: new RateRedisStore({
    client: redis,
    prefix: REDIS_RATE_LIMIT_PREFIX
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// const speedLimiter = slowDown({
//   store: new RateRedisStore({
//     client: redis,
//     prefix: REDIS_SLOW_DOWN_PREFIX
//   }),
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   delayAfter: 5, // allow 100 requests per 15 minutes, then...
//   delayMs: 500 // begin adding 500ms of delay per request above 100:
//   // request # 101 is delayed by  500ms
//   // request # 102 is delayed by 1000ms
//   // request # 103 is delayed by 1500ms
//   // etc.
// });

app.use(limiter);

// always call this before createconnecitons
server.applyMiddleware({ app });

createConnection()
  .then(async () => {
    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  })
  .catch(error => console.log(error));
