import { GQLResolver } from "../../../types/graphqlTypes";
import { User } from "../../../entity/User";
import * as argon2 from "argon2";
import { errorMessage, forgotPasswordLockedError } from "./errorMessages";
import { loginSchema } from "@tgs/common";
import { formatYupErrors } from "../../../utils/formatYupErrors";
import { REDIS_SESSION_ID_PREFIX } from "../../../constants";

export const resolver: GQLResolver = {
  Mutation: {
    login: async (_, args, { req, redis }) => {
      try {
        await loginSchema.validate(args, { abortEarly: false });
      } catch (err) {
        formatYupErrors(err);
      }
      const { email, password } = args;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorMessage;
      }

      if (!user.confirmed) {
        return [
          { path: "email", message: "please confirm you email to login" }
        ];
      }
      if (user.forgotPasswordLocked) {
        return [
          {
            path: "email",
            message: forgotPasswordLockedError
          }
        ];
      }

      const checkPassword = await argon2.verify(user.password, password);
      if (!checkPassword) {
        return errorMessage;
      }

      req.session!.userId = await user.id;

      if (req.sessionID) {
        await redis.lpush(
          `${REDIS_SESSION_ID_PREFIX}${user.id}`,
          req.sessionID
        );
      }
      return null;
    }
  }
};
