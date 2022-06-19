import { Request, Response } from "express";

export interface UserType {
  id: string;
  username: string;
  email: string;
  joined_on: Date;
}

export interface GQLContextType {
  req: Request;
  res: Response;
  userId: string;
}
