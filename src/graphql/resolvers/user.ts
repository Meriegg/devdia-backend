import prisma from "../../prisma/index";
import jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server-express";
import * as argon from "argon2";

export const userResolvers = {
  Query: {
    getUser: async (_: any, args: any) => {
      const user = await prisma.user.findUnique({
        where: {
          id: args.id,
        },
      });
      if (!user) {
        throw new ApolloError("Could not find user!");
      }

      return user;
    },
  },
  Mutation: {
    register: async (_: any, { args }: any) => {
      try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          throw new ApolloError("Something went wrong on our end!");
        }

        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: args.email }, { username: args.username }],
          },
        });
        if (existingUser) {
          throw new ApolloError("User already exists!");
        }

        const hashedPass = await argon.hash(args.password);

        const newUser = await prisma.user.create({
          data: {
            username: args.username,
            email: args.email,
            password: hashedPass,
          },
        });

        const newAccessToken = jwt.sign({ sub: newUser.id }, JWT_SECRET, {
          expiresIn: "30min",
        });

        return { user: newUser, accessToken: newAccessToken };
      } catch (error) {
        console.error(error);
        throw new ApolloError(error?.message || error || "Something went wrong!");
      }
    },
  },
};
