import { v4 } from "uuid";
import { Redis } from "ioredis";
import { EMAIL_CONFIRM_PREFIX } from "../constants";

export const emailConfirmationLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();

  await redis.set(`${EMAIL_CONFIRM_PREFIX}${id}`, userId, "ex", 60 * 60 * 24);
  return `${url}/confirm/${id}`;
};
