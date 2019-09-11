import * as Fastify from "fastify";
import * as Payload from "slack-payload";
import { AddressInfo } from "net";
import QueueHolder from "./Chimas/QueueHolder";
import { SlackPayload } from "../LocalDefinitions";
const server = Fastify({ logger: true });

const queues = new QueueHolder();

server.post("/new", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_id;
  try {
    queues.create(name);
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
  }
  reply.send(`Queue started for channel ${name}`);
});

server.get("/join", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_id;
  const user = payload.user_id;
  try {
    queues.get(name).add(user);
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
  }
  reply.send(`${name} has joined the queue!`);
});

server.get("/leave", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_id;
  const user = payload.user_id;
  try {
    queues.get(name).remove(user);
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
  }
  reply.send(`User ${user} has left the queue.`);
});

server.get("/next", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_id;
  let next: string = "";
  try {
    next = queues.get(name).whosNext();
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
  }
  reply.send(`The next in queue is ${next}.`);
});

server.get("/who", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_id;
  let usersInQueue: string;
  try {
    usersInQueue = queues.get(name).getGuestList().join(", ");
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
  }
  reply.send(`The following users are in this queue: ${usersInQueue}.`);
});

server.get("/clear", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_id;
  try {
    queues.get(name).clear();
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
  }
  reply.send(`The queue has been cleared!`);
});

const start = async () => {
  try {
    const parsed = parseInt(process.env.PORT);
    const port = parsed === 0 ? 80 : parsed;
    await server.listen(port, "0.0.0.0");
    const realPort = (server.server.address() as AddressInfo).port;
    server.log.info(`server listening on ${realPort}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();