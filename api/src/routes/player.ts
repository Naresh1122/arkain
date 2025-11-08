import { Router } from "express";
import { db } from "../db";
import { redis } from "../redis";

const router = Router();

router.get("/:id", async (req, res) => {
  const playerId = req.params.id;

  const cacheKey = `player:${playerId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const player = await db.collection("players").findOne({ playerId });
  if (!player) return res.status(404).json({ error: "Player not found" });

  await redis.set(cacheKey, JSON.stringify(player), { EX: 60 });

  res.json(player);
});

router.get("/plays/:id", async (req, res) => {
  const plays = await db.collection("plays").find({ playerId: req.params.id }).toArray();
  res.json(plays);
});

export default router;
