import { db, connectDB } from "../db";

export async function seedGames() {
  await connectDB();

  const collectionName = process.env.GAMES_COLLECTION || "games";
  const gamesCollection = db.collection(collectionName);


  const now = new Date();

  const games = [
    { id: "G001", name: "american-football", status: "active" },
    { id: "G002", name: "volleyball", status: "active" },
    { id: "G003", name: "basketball", status: "active" },
    { id: "G004", name: "soccer", status: "active" },
    { id: "G005", name: "ice-hockey", status: "active" },
    { id: "G006", name: "lacrosse", status: "active" }
  ].map(game => ({
    ...game,
    createdAt: now,
    updatedAt: now,
  }));

  await gamesCollection.deleteMany({});
  await gamesCollection.insertMany(games);

  console.log("✅ Games seeded successfully");
}
