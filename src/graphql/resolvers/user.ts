import prisma from "../../prisma/index";
import jwt from "jsonwebtoken";
import setRefreshToken from "../../utils/setRefreshToken";
import { ApolloError, UserInputError } from "apollo-server-express";
import * as argon from "argon2";
import { GQLContextType } from "src/types";

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
    register: async (_: any, { args }: any, { res }: GQLContextType) => {
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

        const hashedPass = await argon.hash(args.password, { saltLength: 16 });

        const newUser = await prisma.user.create({
          data: {
            username: args.username,
            email: args.email,
            password: hashedPass,
          },
        });

        const newAccessToken = jwt.sign(
          { sub: newUser.id, isRefresh: true },
          JWT_SECRET,
          {
            expiresIn: "15min",
          }
        );
        const refreshToken = jwt.sign({ sub: newUser.id, isRefresh: true }, JWT_SECRET, {
          expiresIn: "14d",
        });

        await setRefreshToken(newUser.id, refreshToken, res);

        return { userData: newUser, accessToken: newAccessToken };
      } catch (error) {
        console.error(error);
        throw new ApolloError(error?.message || error || "Something went wrong!");
      }
    },
    login: async (_: any, { args }: any, { res }: GQLContextType) => {
      try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          throw new ApolloError("Something went wrong on our end!");
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
        if (!existingUser) {
          throw new UserInputError("User does not exist!");
        }

        const doPasswordsMatch = await argon.verify(existingUser.password, args.password);
        if (!doPasswordsMatch) {
          throw new UserInputError("Incorrect password!");
        }

        const accessToken = jwt.sign(
          { sub: existingUser.id, isRefresh: false },
          JWT_SECRET,
          { expiresIn: "15min" }
        );
        const refreshToken = jwt.sign(
          { sub: existingUser.id, isRefresh: true },
          JWT_SECRET,
          { expiresIn: "14d" }
        );

        await setRefreshToken(existingUser.id, refreshToken, res);

        return {
          userData: existingUser,
          accessToken,
        };
      } catch (error) {
        console.error(error);
        throw new ApolloError(error?.message || error || "Something went wrong!");
      }
    },
  },
};
