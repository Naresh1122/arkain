// import dotenv from "dotenv";
// dotenv.config();

// import { db, connectDB } from "../db";
// import { redis, connectRedis } from "../redis";

// export async function startPlayerConsumer() {
//   await connectDB();
//   await connectRedis();

//   console.log("✅ MongoDB Connected");
//   console.log("✅ Redis Connected");

//   const players = db.collection(process.env.PLAYERS_COLLECTION || "players");
//   const plays = db.collection(process.env.PLAYS_COLLECTION || "plays");

//   const subscriber = redis.duplicate();
//   await subscriber.connect();

//   await subscriber.subscribe("get_player", async (raw) => {
//     const { correlationId, payload } = JSON.parse(raw);
//     const { playerId } = payload;

//     const player = await players.findOne({ playerId });

//     await redis.publish(
//       `response:${correlationId}`,
//       JSON.stringify(player || null)
//     );
//   });

//   await subscriber.subscribe("get_player_plays", async (raw) => {
//     const { correlationId, payload } = JSON.parse(raw);
//     const { playerId } = payload;

//     const playerPlays = await plays.find({ playerId }).toArray();

//     await redis.publish(
//       `response:${correlationId}`,
//       JSON.stringify(playerPlays)
//     );
//   });
//   console.log("🎧 Player consumer listening for requests...");
// }

// startPlayerConsumer().catch(console.error);
