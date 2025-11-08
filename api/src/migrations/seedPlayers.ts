import { MongoClient } from "mongodb";

async function seed() {
  const mongo = new MongoClient("mongodb://127.0.0.1:27017");
  await mongo.connect();
  const db = mongo.db("arkain");
  const players = db.collection("players");

  const dummyPlayers = [
    {
      playerId: "P001",
      name: "John Doe",
      totalGames: 5,
      totalBets: 500,
      totalWins: 150,
    },
    {
      playerId: "P002",
      name: "Alice Smith",
      totalGames: 12,
      totalBets: 1200,
      totalWins: 800,
    },
    {
      playerId: "P003",
      name: "Bob Johnson",
      totalGames: 3,
      totalBets: 150,
      totalWins: 50,
    },
  ];

  await players.insertMany(dummyPlayers);

  console.log("✅ Dummy players seeded successfully!");
  await mongo.close();
}

seed().catch(console.error);
