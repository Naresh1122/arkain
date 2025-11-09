import dotenv from "dotenv";
dotenv.config();
import amqplib from "amqplib";
import { db, connectDB } from "./db";
import { redis, connectRedis } from "./redis";

async function startWorker() {
  await connectDB();
  await connectRedis();

  console.log("MongoDB Connected");
  console.log("Redis Connected");

  const players = db.collection("players");
  const plays = db.collection("plays");

  const conn = await amqplib.connect("amqp://127.0.0.1:5672");
  const ch = await conn.createChannel();

  // Ensure queues exist
  await ch.assertQueue("game.plays");
  await ch.assertQueue("get_player");
  await ch.assertQueue("get_player_plays");

  console.log("Worker listening to queues...");
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

  ch.consume("get_player", async (msg) => {
    if (!msg) return;
    const { playerId } = JSON.parse(msg.content.toString());
    const correlationId = msg.properties.correlationId;
    const replyTo = msg.properties.replyTo;

    const player = await players.findOne({ playerId }) || null;

    if (replyTo) {
      ch.sendToQueue(replyTo, Buffer.from(JSON.stringify(player)), { correlationId });
    }

    ch.ack(msg);
  });
  ch.consume("get_player_plays", async (msg) => {
    if (!msg) return;
    const { playerId } = JSON.parse(msg.content.toString());
    const correlationId = msg.properties.correlationId;
    const replyTo = msg.properties.replyTo;

    const playerPlays = await plays.find({ playerId }).toArray();

    if (replyTo) {
      ch.sendToQueue(replyTo, Buffer.from(JSON.stringify(playerPlays)), { correlationId });
    }

    ch.ack(msg);
  });
}

startWorker().catch(console.error);
