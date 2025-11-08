import { Router } from "express";
import { getChannel } from "../rabbit";
import { validate } from "../middlewares/validate";
import { playRequestSchema } from "../schemas/requests/play.schema";
const router = Router();

router.post("/",validate(playRequestSchema), async (req, res) => {
  const { playerId, gameId} = req.body;

  if (!playerId || !gameId) return res.status(400).json({ error: "Invalid payload" });

  const ch = await getChannel();
  ch.sendToQueue("game.plays", Buffer.from(JSON.stringify(req.body)));

  return res.json({ status: "queued" });
});

export default router;
