const { ApolloServer, gql } = require("apollo-server"); 

// hacker newsの１つ１つの投稿について
let links = [
  {
    id: "link-0",
    description: "GraphQL練習",
    url: "google.com"
  }
]

// GraphQLスキーマ定義
// !について、絶対nullではないという意味
const typeDefs = gql`
  type Query {
    info: String!
    feed: [Link]!
  }

  type Mutation {
    post(url: String!, description: String!): Link!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

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
        id: `link-${idCount}++`,
        description: args.description,
        url: args.url,
      };

      links.push(link);
      return link;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーを起動中・・・`));