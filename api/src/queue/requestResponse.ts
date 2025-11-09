import { Channel, ChannelModel  } from "amqplib";
import { randomUUID } from "crypto";
import * as amqp from 'amqplib';
let connection!: ChannelModel; 
let channel!: Channel;

async function getChannel(): Promise<Channel> {
 const url = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

    connection = await amqp.connect(url);
    channel = await connection.createChannel();
  return channel;
}

export async function sendQueueRequest(
  queue: string,
  payload: any,
  timeout = 5000
): Promise<any> {
  const correlationId = randomUUID();
  const channel = await getChannel();

  const { queue: replyQueue } = await channel.assertQueue("", { exclusive: true });

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for response on ${correlationId}`));
    }, timeout);

    channel.consume(
      replyQueue,
      (msg) => {
        if (msg && msg.properties.correlationId === correlationId) {
          clearTimeout(timer);
          resolve(JSON.parse(msg.content.toString()));
        }
      },
      { noAck: true }
    );

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
      correlationId,
      replyTo: replyQueue,
    });
  });
}
