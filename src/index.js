import { startStandaloneServer } from "@apollo/server/standalone";
import createServer from "./createServer.js";

const server = createServer();
const port = Number(process.env.PORT) || 4000;
const { url } = await startStandaloneServer(server, {
  listen: { port },
});

console.log(`🚀 Server ready at ${url}`);
