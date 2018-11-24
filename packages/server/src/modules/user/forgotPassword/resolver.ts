import { GQLResolver } from "../../../types/graphqlTypes";
import { User } from "../../../entity/User";
import { createForgotPasswordLink } from "../../../utils/createForgotPasswordLink";
import { sendEmailToUser } from "../../../utils/sendEmail";
import { FORGOT_PASSWORD_PREFIX } from "../../../constants";
import { expiredKeyError } from "./errorMessages";
import { changePasswordSchema } from "@tgs/common";
import { formatYupErrors } from "../../../utils/formatYupErrors";
import * as argon2 from "argon2";

export const resolver: GQLResolver = {
  Mutation: {
    sendForgotPasswordEmail: async (_, { email }, { redis }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return false;
      }
      const url = await createForgotPasswordLink(
        process.env.FRONTEND_HOST!,
        user.id,
        redis
      );
      await sendEmailToUser(email, url, "reset password");
      return true;
    },
    forgotPasswordChange: async (_, { newPassword, key }, { redis }) => {
      const redisKey = `${FORGOT_PASSWORD_PREFIX}${key}`;

      const userId = await redis.get(redisKey);
      if (!userId) {
        return [
          {
            path: "newPassword",
            message: expiredKeyError
          }
        ];
      }

      try {
        await changePasswordSchema.validate(
          { newPassword },
          { abortEarly: false }
        );
      } catch (err) {
        return formatYupErrors(err);
      }

      const hashedPassword = await argon2.hash(newPassword);

      const updatePromise = User.update(
        { id: userId },
        { forgotPasswordLocked: false, password: hashedPassword }
      );

      const deleteKeyPromise = redis.del(redisKey);

      await Promise.all([updatePromise, deleteKeyPromise]);

      // todo delete all previous sessions when password has changed to new
      // todo forgotPasswordLocked entity is always false in login and here as well, it does not do anything, thought of locking the account
      // when user tries to send email for forgot password. but that makes anybody can lock someones account.s

      return null;
    }
  }
};
