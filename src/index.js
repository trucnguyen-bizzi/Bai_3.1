import { startStandaloneServer } from "@apollo/server/standalone";
import { getUserFromRequest } from "./auth.js";
import createServer from "./createServer.js";

const server = createServer();
const port = Number(process.env.PORT) || 4000;
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ user: getUserFromRequest(req) }),
  listen: { port },
});

console.log(`🚀 Server ready at ${url}`);
