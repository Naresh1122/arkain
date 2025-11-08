import amqplib from "amqplib";

let ch: any;

export async function getChannel() {
  if (ch) return ch;
  const conn = await amqplib.connect("amqp://localhost");
  ch = await conn.createChannel();
  await ch.assertQueue("game.plays");
  console.log("✅ RabbitMQ Connected");
  return ch;
}
