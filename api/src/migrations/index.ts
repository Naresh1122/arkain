import { connectDB } from "../db";
import { seedPlayers } from "./seedPlayers";
import { seedGames } from "./seedGames";

async function runMigrations() {
  try {
    await connectDB();
    console.log("Database Connected");

    await seedPlayers();
    console.log("Players Seeded");

    await seedGames();
    console.log("Games Seeded");

  } catch (error) {
    console.error("Migration Error:", error);
  } finally {
    process.exit(0);
  }
}

runMigrations();
