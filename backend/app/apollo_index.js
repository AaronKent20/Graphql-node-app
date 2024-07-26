import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Post {
    title: String
    order: Int
  }

  type Query {
    posts: [Post]
  }
`;

const resolvers = {
  Query: {
    posts: () => posts
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(apolloServer, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
