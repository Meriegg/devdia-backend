import prisma from "../../prisma";
import useProtected from "../../utils/useProtected";
import { GQLContextType } from "src/types";

export const postResolvers = {
  Query: {
    getPost: async (_: any, { postId }: any, { userId }: GQLContextType) => {
      useProtected(userId);

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          author: true,
          likes: {
            include: {
              user: true,
              post: true,
            },
          },
        },
      });

      return post;
    },
  },
  Mutation: {
    createPost: async (_: any, { args }: any, { userId }: GQLContextType) => {
      useProtected(userId);

      const newPost = await prisma.post.create({
        data: {
          author_id: userId,
          code: args?.code,
          content: args?.content,
        },
        include: {
          author: true,
          likes: true,
        },
      });

      return newPost;
    },
    likePost: async (_: any, { postId }: any, { userId }: GQLContextType) => {
      useProtected(userId);

      const newLike = await prisma.like.create({
        data: {
          post_id: postId,
          user_id: userId,
        },
        include: {
          post: true,
          user: true,
        },
      });

      return newLike;
    },
  },
};
