import users from "./users.js";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { requireAuth, signToken } from "./auth.js";
import { privateField } from "./permissions.js";

const resolvers = {
  Query: {
    hello: () => "Xin chào GraphQL!",
    me: (parent, args, context) => requireAuth(context),
    users: (parent, args, context) => {
      requireAuth(context);

      return users;
    },
    user: (parent, args, context) => {
      requireAuth(context);

      return users.find((user) => user.id === args.id) ?? null;
    },
  },
  Mutation: {
    login: (parent, args) => {
      const user = users.find((user) => user.username === args.username);

      if (!user || !bcrypt.compareSync(args.password, user.password)) {
        throw new GraphQLError("Sai tên đăng nhập hoặc mật khẩu", {
          extensions: {
            code: "UNAUTHENTICATED",
            http: {
              status: 401,
            },
          },
        });
      }

      return {
        token: signToken(user),
        user,
      };
    },
  },
  User: {
    email: privateField("email"),
    phone: privateField("phone"),
    role: privateField("role"),
  },
};

export default resolvers;
