import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    joined_on: String!
  }

  type Query {
    getUser(id: ID!): User!
  }

  input RegisterInput {
    email: String!
    password: String!
    username: String!
  }

  type Mutation {
    register(args: RegisterInput!): User!
  }
`;
