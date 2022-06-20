import { AuthenticationError } from "apollo-server-express";

export default (userId: string) => {
  if (userId) {
    return;
  }

  throw new AuthenticationError("You are not logged in!");
};
