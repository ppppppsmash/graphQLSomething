const { ApolloServer, gql } = require("apollo-server"); 

// GraphQLスキーマ定義
const typeDefs = gql`
  type Query {
    info: String! //絶対nullではないという意味
  }
`;

// リゾルバ関数、typeDefsの型に対して、何かの値を与える
const resolvers = {
  Query: {
    info: () =>  "HackerNewsクローン",
  }
};