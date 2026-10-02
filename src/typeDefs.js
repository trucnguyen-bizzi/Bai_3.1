const typeDefs = `#graphql
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
    users: [User!]!
    user(id: ID!): User
  }
`;

export default typeDefs;
