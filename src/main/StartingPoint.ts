import * as Fastify from "fastify";
import * as Payload from "slack-payload";
import { AddressInfo } from "net";
import QueueHolder from "./Chimas/QueueHolder";
import { SlackPayload } from "../LocalDefinitions";
import * as fastifyFormBody from "fastify-formbody";
const server = Fastify({ logger: true });

server.register(fastifyFormBody);

const queues = new QueueHolder();

server.post("/new", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  try {
    queues.create(name);
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
    reply.send(e);
  }
  reply.type("application/json");
  reply.send({ text: `Queue started for channel ${name}`});
});

server.post("/join", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  const user = payload.user_name;
  try {
    queues.get(name).add(user);
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
    reply.send(e);
  }
  reply.send(`${name} has joined the queue!`);
});

server.post("/leave", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  const user = payload.user_name;
  try {
    queues.get(name).remove(user);
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
    reply.send(e);
  }
  reply.send(`User ${user} has left the queue.`);
});

server.post("/next", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  let next: string = "";
  try {
    next = queues.get(name).whosNext();
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
    reply.send(e);
  }
  reply.send(`The next in queue is ${next}.`);
});

server.post("/who", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  let usersInQueue: string;
  try {
    usersInQueue = queues.get(name).getGuestList().join(", ");
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
    reply.send(e);
  }
  reply.send(`The following users are in this queue: ${usersInQueue}.`);
});

server.post("/clear", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  const name = payload.channel_name;
  try {
    queues.get(name).clear();
    reply.code(200);
  } catch (e) {
    server.log.error(e);
    reply.code(400);
    reply.send(e);
  }
  reply.send(`The queue has been cleared!`);
});

server.post("/test", async (req, reply) => {
  const payload = new Payload(req.body) as SlackPayload;
  reply.send(JSON.stringify(payload));
});

const start = async () => {
  try {
    const parsed = parseInt(process.env.PORT);
    const port = parsed === 0 ? 80 : parsed;
    const address = process.env.DOCKER ? "0.0.0.0" : "127.0.0.1";
    await server.listen(port, address);
    const realPort = (server.server.address() as AddressInfo).port;
    server.log.info(`server listening on ${realPort}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();