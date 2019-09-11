import * as Fastify from "fastify";
import * as Payload from "slack-payload";
import { AddressInfo } from "net";
import QueueHolder from "./chimas/QueueHolder";
import { SlackPayload } from "../LocalDefinitions";
import * as fastifyFormBody from "fastify-formbody";
const server = Fastify({ logger: true });

server.register(fastifyFormBody);

const queues = new QueueHolder();

server.post("/new", async (req, reply) => {
  let message: string;
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  try {
    queues.create(name);
    message = `Queue started for channel ${name}`;
  } catch (e) {
    message = e.message;
  }
  reply.send(message);
});

server.post("/join", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  let message;
  const name = payload.channel_name;
  const user = payload.user_name;
  try {
    queues.get(name).add(user);
    message = `${user} has joined the queue!`;
  } catch (e) {
    message = e.message;
  }
  reply.send(message);
});

server.post("/leave", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  const user = payload.user_name;
  let message: string;
  try {
    queues.get(name).remove(user);
    message = `User ${user} has left the queue.`;
  } catch (e) {
    message = e.message;
  }
  reply.send(message);
});

server.post("/next", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  let next: string = "";
  let message: string;
  try {
    next = queues.get(name).whosNext();
    message = `The next in queue is ${next}.`;
  } catch (e) {
    message = e.message;
  }
  reply.send(message);
});

server.post("/who", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  let usersInQueue: string;
  let message: string;
  try {
    usersInQueue = queues.get(name).getGuestList().join(", ");
    message = `The following users are in this queue: ${usersInQueue}.`;
  } catch (e) {
    message = e.message;
  }
  reply.send(message);
});

server.post("/clear", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  let message: string;
  try {
    queues.get(name).clear();
    message = `The queue has been cleared!`;
  } catch (e) {
    message = e.message;
  }
  reply.send(message);
});

server.post("/test", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  reply.send(JSON.stringify(payload));
});

const start = async () => {
  try {
    let port = 3000;
    if (process.env.PORT) {
      port = parseInt(process.env.PORT);
    }
    const address = process.env.DOCKER ? "0.0.0.0" : "127.0.0.1";
    await server.listen(port, address);
    const realPort = (server.server.address() as AddressInfo).port;
    server.log.info(`server listening on ${realPort}`);
  } catch (err) {
    process.exit(1);
  }
}

start();