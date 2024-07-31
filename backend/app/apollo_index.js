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
import { resolvers } from './src/apollo/resolvers.js';
import { typeDefs } from './src/apollo/typedefs.js';

const pubsub = new PubSub();

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express()
const httpServer = createServer(app)

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
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
  origin: ['https://graphql-node-backend.onrender.com', 'https://graphql-node-app.onrender.com'] // Whitelist the domains you want to allow
};

await server.start();
app.use('/graphql', cors(corsOptions), bodyParser.json(), expressMiddleware(server));

const PORT = 4000
// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
  console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/subscriptions`);
});
