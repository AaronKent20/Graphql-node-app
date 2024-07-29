import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Post } from './src/models/index.js';
import { Op } from 'sequelize';
const typeDefs = `#graphql
  type Post {
    id: Int
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
      return await Post.findAll({order: ['order']})
    }
  },
  Mutation: {
    async UpdatePostOrder(_, {id, order}) {
      const post = await Post.findByPk(id)
      if(post.order < order) {
        // Shuffle rows down to account for post moving up
        await Post.decrement({order: 1}, {where: {order: {
          [Op.lte]: order,
          [Op.gte]: post.order,
        } }})
        post.order = order
        await post.save()
      }

      if(post.order > order) {
        // Shuffle rows up to account for post moving down
        await Post.increment({order: 1}, {where: {order: {
          [Op.gte]: order,
          [Op.lte]: post.order
        }}})
        post.order = order
        await post.save()
      }      
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
