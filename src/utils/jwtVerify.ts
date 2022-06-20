import jwt from "jsonwebtoken";
import { Request } from "express";

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
