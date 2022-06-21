import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String
    joined_on: String!
    r_t: String
  }

  type AuthResponse {
    userData: User!
    accessToken: String!
  }

  type Query {
    getUser(id: ID!): User!
    refreshToken: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    username: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Mutation {
    register(args: RegisterInput!): AuthResponse!
    login(args: LoginInput!): AuthResponse!
  }
`;
