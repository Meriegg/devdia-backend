import { gql } from "apollo-server-express";

export const postTypeDefs = gql`
  type Like {
    id: String!
    post_id: String!
    user_id: String

    post: Post!
    user: User!
  }

  type Post {
    id: String!
    code: String
    content: String
    author_id: String!
    likes: [Like!]!

    author: User!
  }

  input CreatePostInput {
    code: String
    content: String
  }

  type Query {
    getPost(postId: String!): Post!
  }

  type Mutation {
    createPost(args: CreatePostInput!): Post!
    likePost(postId: String!): Like!
  }
`;
