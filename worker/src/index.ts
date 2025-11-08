import amqplib from "amqplib";
import { MongoClient } from "mongodb";
import { createClient } from "redis";

// ✅ Using localhost since Worker is running on host machine
const mongo = new MongoClient("mongodb://127.0.0.1:27017");
const redis = createClient({ url: "redis://127.0.0.1:6379" });

async function startWorker() {
  await mongo.connect();
  await redis.connect();

  console.log("✅ MongoDB Connected");
  console.log("✅ Redis Connected");

  const db = mongo.db("arkain");
  const players = db.collection("players");
  const plays = db.collection("plays");

  const conn = await amqplib.connect("amqp://127.0.0.1:5672");
  const ch = await conn.createChannel();
  await ch.assertQueue("game.plays");

  console.log("🎯 Worker listening to game.plays...");

  ch.consume("game.plays", async (msg) => {
  if (!msg) return;

  const data = JSON.parse(msg.content.toString());

  // ✅ Stable idempotency key
  const key = `play:${data.playerId}:${data.gameId}:${data.betAmount}:${data.winAmount}`;

  // ✅ Check if already processed
  if (await redis.exists(key)) {
    console.log("⏭ Skipping duplicate:", key);
    return ch.ack(msg);
  }

  console.log("🎲 Processing play:", data);

  await plays.insertOne({ ...data, createdAt: new Date() });

  await players.updateOne(
    { playerId: data.playerId },
    { $inc: { totalGames: 1, totalBets: data.betAmount, totalWins: data.winAmount } },
    { upsert: true }
  );

  // ✅ Store key for 60 seconds
  await redis.set(key, "1", { EX: 60 });

  ch.ack(msg);
});
}

// ✅ CALL THE FUNCTION (instead of top-level await)
startWorker().catch(console.error);
