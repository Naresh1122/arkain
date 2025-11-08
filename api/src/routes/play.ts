import { Router } from "express";
import { getChannel } from "../rabbit";

const router = Router();

router.post("/", async (req, res) => {
  const { playerId, gameId, betAmount, winAmount } = req.body;

  if (!playerId || !gameId) return res.status(400).json({ error: "Invalid payload" });

  const ch = await getChannel();
  ch.sendToQueue("game.plays", Buffer.from(JSON.stringify(req.body)));

  return res.json({ status: "queued" });
});

export default router;
