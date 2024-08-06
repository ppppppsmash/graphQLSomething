const { ApolloServer, gql } = require("apollo-server"); 

// GraphQLスキーマ定義
// !について、絶対nullではないという意味
const typeDefs = gql`
  type Query {
    info: String! 
  }
`;

// リゾルバ関数、typeDefsの型に対して、何かの値を与える
const resolvers = {
  Query: {
    info: () =>  "HackerNewsクローン",
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(({ url }) => console.log(`${url}でサーバーを起動中・・・`));