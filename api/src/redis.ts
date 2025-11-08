import { createClient } from "redis";

export const redis = createClient({ url: "redis://127.0.0.1:6379" });

export async function connectRedis() {
  redis.on("error", console.error);
  await redis.connect();
  console.log("✅ Redis Connected");
}
