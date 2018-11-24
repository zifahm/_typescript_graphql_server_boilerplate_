import { GQLResolver } from "../../../types/graphqlTypes";
import { User } from "../../../entity/User";
import { registerSchema } from "@tgs/common";
import { formatYupErrors } from "../../../utils/formatYupErrors";
import { sendEmailToUser } from "../../../utils/sendEmail";
import { emailConfirmationLink } from "../../../utils/emailConfirmationLink";

export const resolver: GQLResolver = {
  Mutation: {
    register: async (_, args, { url, redis }) => {
      try {
        await registerSchema.validate(args, { abortEarly: false });
      } catch (err) {
        formatYupErrors(err);
      }
      const userExist = await User.findOne({ where: { email: args.email } });
      if (userExist) {
        return [
          {
            path: "email",
            message: "email already in use"
          }
        ];
      }

      const user = await User.create(args);

      await user.save();

      sendEmailToUser(
        user.email,
        await emailConfirmationLink(url, user.id, redis),
        "confirm email"
      );
      return null;
    }
  }
};
