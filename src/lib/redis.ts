import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: (() => {
    if (!process.env.UPSTASH_REDIS_REST_URL)
      throw new Error("Missing env UPSTASH_REDIS_REST_URL");
    return process.env.UPSTASH_REDIS_REST_URL;
  })(),
  token: (() => {
    if (!process.env.UPSTASH_REDIS_REST_TOKEN)
      throw new Error("Missing env UPSTASH_REDIS_REST_TOKEN");
    return process.env.UPSTASH_REDIS_REST_TOKEN;
  })(),
});
