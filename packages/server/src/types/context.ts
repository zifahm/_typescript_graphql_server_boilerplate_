import { Redis } from "ioredis";

export interface Context {
  req: Express.Request;
  redis: Redis;
  url: string;
}
