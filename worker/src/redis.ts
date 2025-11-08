import { createClient } from "redis";
const {
REDIS_HOST,
REDIS_PORT,
} = process.env;
export const redis = createClient({
  socket: {
    host: REDIS_HOST,
    port: Number(REDIS_PORT)
  }
});

export async function connectRedis() {
  await redis.connect();
  console.log("Redis Connected");
}
