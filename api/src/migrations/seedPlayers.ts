import { db, connectDB } from "../db";

export async function seedPlayers() {
  await connectDB();

  const collectionName = process.env.PLAYERS_COLLECTION || "players";
  const playersCollection = db.collection(collectionName);

  const now = new Date();

  const players = [
    {
      playerId: "P001",
      name: "Naresh",
      totalGames: 5,
      totalBets: 500,
      totalWins: 150,
      createdAt: now,
      updatedAt: now,
    },
    {
      playerId: "P002",
      name: "Suresh",
      totalGames: 12,
      totalBets: 1200,
      totalWins: 800,
      createdAt: now,
      updatedAt: now,
    },
    {
      playerId: "P003",
      name: "Harish",
      totalGames: 3,
      totalBets: 150,
      totalWins: 50,
      createdAt: now,
      updatedAt: now,
    },
  ];

  await playersCollection.deleteMany({});
  await playersCollection.insertMany(players);

  console.log("✅ Players seeded successfully");
}
