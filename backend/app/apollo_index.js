import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Post } from './src/models/index.js';
const typeDefs = `#graphql
  type Post {
    title: String
    order: Int
  }

  type Query {
    posts: [Post]
  }
  
  type Mutation { 
    UpdatePostOrder(
    id: Int
    order: Int
    ): Post
  }
`;

const resolvers = {
  Query: {
    async posts () { 
      return await Post.findAll()
    }
  },
  Mutation: {
    async UpdatePostOrder(_, {id, order}) {
      const post = Post.findById(id)

      // Todo: Handle Drag and Drop Logic
    },
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(apolloServer, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
