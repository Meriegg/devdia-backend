import prisma from "../prisma/index";
import * as argon from "argon2";
import { Response } from "express";

export default async (userId: string, refreshToken: string, res: Response) => {
  const hashedRefreshToken = await argon.hash(refreshToken, { saltLength: 16 });

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      r_t: hashedRefreshToken,
    },
  });

  // Create a date exactly 14 days from now which will be used for the
  // refresh token cookie expiry date
  var expire = new Date();
  expire.setTime(new Date().getTime() + 3600000 * 24 * 14);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    expires: expire,
    sameSite: "none",
  });

  return updatedUser;
};
