const http = require("http");
const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema");
const grapgQlResolvers = require("./graphql/resolvers");
const validateToken = require("./helpers/auth");

// Loaders
const userLoader = require("./loaders/userLoader");
const orchestraLoader = require("./loaders/orchestraLoader");
const memberLoader = require("./loaders/memberLoader");
const inviteLoader = require("./loaders/inviteLoader");
const messageLoader = require("./loaders/messageLoader");
const channelLoader = require("./loaders/channelLoader");

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB,
  TARGET_PORT,
  PUBLISHED_HOST = "http://localhost",
  PUBLISHED_PORT
} = process.env;

const app = express();

async function setupContext(token) {
  const loaders = {
    userLoader: userLoader(),
    orchestraLoader: orchestraLoader(),
    memberLoader: memberLoader(),
    inviteLoader: inviteLoader(),
    messageLoader: messageLoader(),
    channelLoader: channelLoader()
  };
  try {
    const { userId } = await validateToken(token);
    return {
      loaders,
      userId,
      isAuth: true
    };
  } catch (err) {
    return {
      isAuth: false
    };
  }
}

function getTokenFromRequest(req) {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    return authHeader.split(" ")[1];
  }
}

const server = new ApolloServer({
  typeDefs: graphQlSchema,
  resolvers: grapgQlResolvers,

  context: async ({ req, payload }) => {
    const token = payload ? payload.authToken : getTokenFromRequest(req);

    return await setupContext(token);
  },
  formatError: err => {
    // Don't give the specific errors to the client.
    if (err.message.startsWith("Database Error: ")) {
      return new Error("Internal server error");
    }
    if (err.message.startsWith("Unauthenticated")) {
      return new Error("Authentication error");
    }
    console.log(err);
    // Otherwise return the original error.  The error can also
    // be manipulated in other ways, so long as it's returned.
    return err;
  },
  playground: {
    endpoint: `http://${PUBLISHED_HOST}:${PUBLISHED_PORT}/graphql`,
    subscriptionEndpoint: `ws://${PUBLISHED_HOST}:${PUBLISHED_PORT}/graphql`
  }
});

//app.use("/graphql", isAuth);

server.applyMiddleware({ app, cors: true });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Setup mongoose

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);

//
// Connect to Database
//

mongoose
  .connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to database");

    // ⚠️ Pay attention to the fact that we are calling `listen` on the http server variable, and not on `app`.
    httpServer.listen(TARGET_PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${TARGET_PORT}${server.graphqlPath}`
      );
      console.log(
        `🚀 Subscriptions ready at ws://localhost:${TARGET_PORT}${server.subscriptionsPath}`
      );
    });
  })
  .catch(err => {
    console.error(err);
  });