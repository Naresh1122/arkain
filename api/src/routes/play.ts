import { Router } from "express";
import { getChannel } from "../rabbit";
import { validate } from "../middlewares/validate";
import { playRequestSchema } from "../schemas/requests/play.schema";
import { db } from "../db";
const gameCollectionName = process.env.GAMES_COLLECTION || "games";
const router = Router();
const gamesCollection = db.collection(gameCollectionName);
router.post("/", validate(playRequestSchema), async (req, res) => {
  const { playerId, gameId } = req.body;

  if (!playerId || !gameId) return res.status(400).json({ error: "Invalid payload" });
  const gameExists = await gamesCollection.findOne({ id: gameId });
  if (!gameExists) return res.status(404).json({ error: "Game not found" });

  const ch = await getChannel();
  ch.sendToQueue("game.plays", Buffer.from(JSON.stringify(req.body)));

  return res.json({ status: "queued" });
});

export default router;
