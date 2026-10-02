import users from "./users.js";

const resolvers = {
  Query: {
    hello: () => "Xin chào GraphQL!",
    users: () => users,
    user: (parent, args) => users.find((user) => user.id === args.id) ?? null,
  },
};

export default resolvers;
