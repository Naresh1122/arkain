import dotenv from "dotenv";
dotenv.config();
import amqplib from "amqplib";
import { db,connectDB } from "./db";
import { redis,connectRedis } from "./redis";

async function startWorker() {
  await connectDB();
  await connectRedis();

  console.log("MongoDB Connected");
  console.log("Redis Connected");

  const players = db.collection("players");
  const plays = db.collection("plays");

  const conn = await amqplib.connect("amqp://127.0.0.1:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue("game.plays");

  console.log("Worker listening to game.plays...");

  ch.consume("game.plays", async (msg) => {
    if (!msg) return;

    const data = JSON.parse(msg.content.toString());

    const key = `play:${data.playerId}:${data.gameId}:${data.betAmount}:${data.winAmount}`;

    if (await redis.exists(key)) {
      console.log("Skipping duplicate:", key);
      return ch.ack(msg);
    }

    console.log("Processing play:", data);

    await plays.insertOne({ ...data, createdAt: new Date() });

    await players.updateOne(
      { playerId: data.playerId },
      { $inc: { totalGames: 1, totalBets: data.betAmount, totalWins: data.winAmount } },
      { upsert: true }
    );

    await redis.set(key, "1", { EX: 60 });

    ch.ack(msg);
  });
}
startWorker().catch(console.error);
