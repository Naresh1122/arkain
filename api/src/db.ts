import dotenv from "dotenv";
dotenv.config(); 
import { MongoClient } from "mongodb";
const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_DB
} = process.env;
let mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
if (MONGO_USER && MONGO_PASSWORD) {
  mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
}
const client = new MongoClient(mongoUri);

export const db = client.db(`${MONGO_DB}`);

export async function connectDB() {
  await client.connect();
  console.log("✅ MongoDB Connected");
}
