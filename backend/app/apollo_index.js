import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Post } from './src/models/index.js';
import { Op } from 'sequelize';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { PubSub } from 'graphql-subscriptions';
import bodyParser from 'body-parser';

const pubsub = new PubSub();

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

  type Subscription {
    orderChanged: Boolean
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
      pubsub.publish('ORDER_CHANGED', { orderChanged: true });
    },
  },
  Subscription: {
    orderChanged: {
      subscribe: () => pubsub.asyncIterator(['ORDER_CHANGED']),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express()
const httpServer = createServer(app)

const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

const corsOptions = {
  credentials: true,
  origin: ['http://graphql-node-backend.onrender.com', 'http://graphql-node-backend.onrender.com'] // Whitelist the domains you want to allow
};

await server.start();
app.use('/graphql', cors(corsOptions), bodyParser.json(), expressMiddleware(server));

const PORT = 4000
// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/subscriptions`);
});
