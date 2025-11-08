import amqplib from "amqplib";

export async function getChannel() {
  const conn = await amqplib.connect(`amqp://${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`);
  const ch = await conn.createChannel();
  await ch.assertQueue("game.plays");
  return ch;
}