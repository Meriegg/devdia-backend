import jwt from "jsonwebtoken";
import prisma from "../prisma/index";
import * as argon from "argon2";
import { ApolloError, AuthenticationError } from "apollo-server-express";
import { Request } from "express";

export const verifyRefreshToken = async (req: Request): Promise<string> => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new ApolloError("Something went wrong on our end!");
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AuthenticationError("No refresh token!");
    }

    const decoded: any = jwt.verify(refreshToken, JWT_SECRET);
    if (!decoded?.isRefresh) {
      throw new AuthenticationError("Invalid refresh token!");
    }

    if (Date.now() >= decoded?.exp * 1000) {
      throw new AuthenticationError("Refresh token expired!");
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: decoded?.sub,
      },
    });
    if (!dbUser?.r_t) {
      throw new AuthenticationError("Invalid refresh token!");
    }

    const doTokensMatch = await argon.verify(dbUser.r_t, refreshToken, {
      saltLength: 16,
    });
    if (!doTokensMatch) {
      throw new AuthenticationError("Invalid refresh token!");
    }

    return decoded?.sub;
  } catch (error) {
    console.error(error);

    throw new ApolloError(error?.message || error || "Something went wrong!");
  }
};

export const verifyAccessToken = (req: Request): string | null => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return null;
    }

    const token = req.headers["authorization"]
      ? req.headers["authorization"].split(" ")[1]
      : null;
    if (!token) {
      return null;
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (Date.now() >= decoded?.exp * 1000) {
      return null;
    }

    return decoded?.sub;
  } catch (error) {
    console.error(error);

    return null;
  }
};
