import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db";
import express from "express";
import playRoute from "./routes/play";
import playerRoute from "./routes/player";
import games from "./routes/games";
import { connectRedis } from "./redis";

async function start() {
  await connectDB();
  await connectRedis();

  const app = express();
  app.use(express.json());

  app.use("/play", playRoute);
  app.use("/player", playerRoute);
  app.use("/games", games);
  app.listen(3000, () => console.log("API running on port 3000"));
}

start();
