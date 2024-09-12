const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");

const prisma = new PrismaClient();

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");

// サブスクリプション
// Publisher送信者とSubscriber受信者の関係
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();



// リゾルバ関数、typeDefsの型に対して、何かの値を与える
const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

// リゾルバに連携する
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  }
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーを起動中・・・`));