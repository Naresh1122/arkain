import { Router } from "express";
import { redis } from "../redis";
import { sendQueueRequest } from "../queue/requestResponse";

const router = Router();

router.get("/:id", async (req, res) => {
  const playerId = req.params.id;

  const cacheKey = `player:${playerId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  console.log("/:id",playerId);
  const player = await sendQueueRequest("get_player", { playerId });
  console.log("/:id --response",player);
  if (!player) return res.status(404).json({ error: "Player not found" });

  await redis.set(cacheKey, JSON.stringify(player), { EX: 60 });

  res.json(player);
});

router.get("/plays/:id", async (req, res) => {
  const playerId = req.params.id;
   console.log("/plays/:id----",playerId);
  const plays = await sendQueueRequest("get_player_plays", { playerId });
  console.log("/plays/:id response----",plays);
  res.json(plays);
});

export default router;
