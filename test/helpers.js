import createServer from "../src/createServer.js";

export const run = async (query, { variables, contextValue = {} } = {}) => {
  const server = createServer();
  const response = await server.executeOperation({ query, variables }, { contextValue });

  if (response.body.kind !== "single") {
    throw new Error("Expected a single GraphQL response.");
  }

  return JSON.parse(JSON.stringify(response.body.singleResult));
};
