import { ApolloServer } from "@apollo/server";
import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";

const createServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: false,
  });

export default createServer;
