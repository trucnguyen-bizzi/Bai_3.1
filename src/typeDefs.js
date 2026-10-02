const typeDefs = `#graphql
  type AuthPayload {
    token: String!
    user: User!
  }

  enum Role {
    ADMIN
    USER
  }

  type User {
    id: ID!
    username: String!
    fullName: String!
    email: String
    phone: String
    role: Role
  }

  type Query {
    hello: String!
    me: User
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
  }
`;

export default typeDefs;
