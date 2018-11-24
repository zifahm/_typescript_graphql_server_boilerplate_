import { GQLResolver } from "../../../types/graphqlTypes";
import { REDIS_SESSION_ID_PREFIX } from "../../../constants";

export const resolver: GQLResolver = {
  Mutation: {
    logoutUser: async (_, __, { req, redis }) => {
      if (req.session) {
        const { userId, id } = req.session;
        // to remove the current logged out session id from the list of mltiple session stored in a list
        await redis.lrem(`${REDIS_SESSION_ID_PREFIX}${userId}`, 0, id);
        // destroying the current session of the user
        await req.session.destroy(err => {
          console.log(err);
          return false;
        });
      }

      return true;
    }
  }
};

// multiple session logout

// if (req.session) {
//   const { userId } = req.session;

//   if (userId) {
//     const sessionIds = await redis.lrange(
//       `${REDIS_SESSION_ID_PREFIX}${userId}`,
//       0,
//       -1
//     );

//     const promises = [];
//     for (const value of sessionIds) {
//       promises.push(redis.del(`${REDIS_SESSION_PREFIX}${value}`));
//     }
//     await Promise.all(promises);
//     return true;
//   }
// }
// return false;
