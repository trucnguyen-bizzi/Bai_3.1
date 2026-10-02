import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import users from "./users.js";

const configuredSecret = process.env.JWT_SECRET;

if (process.env.NODE_ENV === "production" && !configuredSecret) {
  throw new Error("JWT_SECRET is required in production.");
}

const secret = configuredSecret || "development-secret";

export const signToken = (user, expiresIn = "1h") =>
  jwt.sign({ sub: user.id }, secret, {
    algorithm: "HS256",
    expiresIn,
  });

export const getUserFromRequest = (req) => {
  const authorization = req?.headers?.authorization;

  if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    const user = users.find((user) => user.id === payload.sub);

    return user ?? null;
  } catch {
    return null;
  }
};

export const requireAuth = (context) => {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: {
          status: 401,
        },
      },
    });
  }

  return context.user;
};
