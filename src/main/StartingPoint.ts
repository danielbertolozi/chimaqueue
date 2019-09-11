import * as Fastify from "fastify";
import * as Payload from "slack-payload";
import { AddressInfo } from "net";
import { SlackPayload } from "../LocalDefinitions";
import * as fastifyFormBody from "fastify-formbody";
import Chimas from "./chimas/Chimas";
const server = Fastify({ logger: true });

server.register(fastifyFormBody);

const chimas = new Chimas();

server.post("/", async (request, reply) => {
  const payload = new Payload(request.body) as SlackPayload;
  const action = payload.text;
  const response = chimas.execute(action, payload);
  reply.send({
    response_type: "in_channel",
    text: response
  });
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
    console.log(err);
    process.exit(1);
  }
}

start();