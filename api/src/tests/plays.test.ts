import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: any;

describe("MongoDB Play Operations (Native Driver)", () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    client = new MongoClient(uri);
    await client.connect();

    db = client.db("testdb");
  });

  afterAll(async () => {
    await client.close();
    await mongoServer.stop();
  });

  test("should insert a play record", async () => {
    const plays = db.collection("plays");

    const playData = {
      playerId: "player1",
      gameId: "gameX",
      betAmount: 50,
      winAmount: 20,
      createdAt: new Date()
    };

    await plays.insertOne(playData);

    const stored = await plays.findOne({ playerId: "player1", gameId: "gameX" });

    expect(stored).not.toBeNull();
    expect(stored?.betAmount).toBe(50);
    expect(stored?.winAmount).toBe(20);
  });

  test("should aggregate total bet and win per game", async () => {
    const plays = db.collection("plays");

    await plays.insertMany([
      { playerId: "playerA", gameId: "g1", betAmount: 10, winAmount: 2 },
      { playerId: "playerA", gameId: "g1", betAmount: 20, winAmount: 5 },
      { playerId: "playerA", gameId: "g2", betAmount: 15, winAmount: 0 }
    ]);

    const result = await plays
      .aggregate([
        { $match: { playerId: "playerA" } },
        {
          $group: {
            _id: "$gameId",
            gamesPlayed: { $sum: 1 },
            totalBets: { $sum: "$betAmount" },
            totalWins: { $sum: "$winAmount" }
          }
        },
        {
          $project: {
            _id: 0,
            gameId: "$_id",
            gamesPlayed: 1,
            totalBets: 1,
            totalWins: 1
          }
        }
      ])
      .toArray();

    expect(result).toEqual(
      expect.arrayContaining([
        { gameId: "g1", gamesPlayed: 2, totalBets: 30, totalWins: 7 },
        { gameId: "g2", gamesPlayed: 1, totalBets: 15, totalWins: 0 }
      ])
    );
  });
});
