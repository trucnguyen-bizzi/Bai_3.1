import { GraphQLError } from "graphql";

export const canViewPrivate = (context, target) => {
  if (!context.user) {
    return false;
  }

  return context.user.role === "ADMIN" || context.user.id === target.id;
};

export const privateField = (fieldName) => (parent, args, context) => {
  if (!canViewPrivate(context, parent)) {
    throw new GraphQLError(`Cannot view private field ${fieldName}`, {
      extensions: {
        code: "FORBIDDEN",
        http: {
          status: 403,
        },
      },
    });
  }

  return parent[fieldName];
};
