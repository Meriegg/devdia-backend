import express from "express";
import dotenv from "dotenv";
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
    context: ({ req, res }) => {
      return { req, res };
    },
  });
  await GQLServer.start();

  // app.use(cors({ origin: "https://studio.apollographql.com", credentials: true }));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: "1mb" }));
  app.use(cookieParser());
  GQLServer.applyMiddleware({
    app,
    cors: {
      origin: "https://studio.apollographql.com",
      credentials: true,
    },
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
