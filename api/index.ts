import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import express, { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { typeDefs } from './src/graphql/schema';
import { resolvers } from './src/graphql/resolvers';
import logger from './src/lib/logger';
import { createContext } from './src/graphql/context';
import router from './src/router';
import { AuthorizedRequest } from './src/types';

dotenv.config();

const port = process.env.PORT || 3000;

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app: Express = express();
const httpServer = createServer(app);

// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
   server: httpServer,
   path: '/graphql',
});
// Save the returned server's info, so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
   schema,
   plugins: [
      ApolloServerPluginInlineTrace(),
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

// Note you must call `server.start()` on the `ApolloServer` instance before passing the instance to `expressMiddleware`
server
   .start()
   .then((r) => {
      // Specify the path where we'd like to mount our server
      app.use(
         '/graphql',
         cors<cors.CorsRequest>(),
         bodyParser.json(),
         expressMiddleware(server, { context: createContext }),
      );

      const allowedOrigins = [process.env.CLIENT_URL];

      const corsOptions: cors.CorsOptions = {
         origin: (origin, callback) => {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
               const msg =
                  'The CORS policy for this site does not allow access from the specified Origin.';
               return callback(new Error(msg), false);
            }
            return callback(null, true);
         },
         credentials: true,
      };

      app.use(cors(corsOptions));

      // parse application/x-www-form-urlencoded
      app.use(bodyParser.urlencoded({ extended: false }));

      // parse application/json
      app.use(bodyParser.json());

      // parse Auth token
      app.use((req: AuthorizedRequest, res, next) => {
         const authHeader = req.headers['authorization'];
         const token = authHeader && authHeader.split(' ')[1];

         // if (token == null) return res.sendStatus(401);
         if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
               if (err) {
                  logger.error(err);
                  return res.sendStatus(403);
               }

               if (user) req.user = user;
            });
         }

         next();
      });

      // RestApi router
      app.use('/api', router);

      httpServer.listen(port, () => {
         logger.info(`Server is running at http://localhost:${port}`);
      });
   })
   .catch((e) => {
      logger.error('Cannot start the Server: ');
      console.log(e.stack);
   });
