import { Router } from "express";
import { db } from "../db";
const router = Router();
const gameCollectionName = process.env.GAMES_COLLECTION || "games";
console.log("gameCllec,",gameCollectionName);

router.get("/", async (req, res) => {
  const games = await db.collection(gameCollectionName).find().toArray();
  res.json(games);
});

export default router;
