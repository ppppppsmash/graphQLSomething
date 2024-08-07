const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// hacker newsの１つ１つの投稿について
let links = [
  {
    id: "link-0",
    description: "GraphQL練習",
    url: "google.com"
  }
]

// リゾルバ関数、typeDefsの型に対して、何かの値を与える
const resolvers = {
  Query: {
    info: () =>  "HackerNewsクローン",
    feed: () => links,
  },
  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    }
  }
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーを起動中・・・`));