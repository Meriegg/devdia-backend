import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import typeDefs from "./graphql/typedefs";
import resolvers from "./graphql/resolvers";
import { ApolloServer } from "apollo-server-express";

// Initialize dotenv
dotenv.config();

(async () => {
  const PORT = process.env.PORT || 5000;
  const app = express();

  const GQLServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await GQLServer.start();

  app.use(cors({ origin: "*" }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "1mb" }));
  app.use(cookieParser());
  GQLServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
