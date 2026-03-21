import { config } from 'dotenv';
config();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import depthLimit from 'graphql-depth-limit';
import { connectDB } from './config/database';
import { verifyToken } from './utils/auth';
import typeDefs from './graphQL/typeDefs/typeDefs';
import resolvers from './graphQL/resolvers/resolvers';

const isProduction = process.env.NODE_ENV === 'production';
if (!process.env.NODE_ENV) {
  console.warn('WARNING: NODE_ENV is not set. Running in development mode — stack traces will be exposed in errors.');
}

async function startServer() {
  const app = express();
  await connectDB();

  const allowedOrigins =
    process.env.CORS_ALLOWED_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  const normalizedAllowedOrigins = allowedOrigins.length
    ? allowedOrigins
    : ['http://localhost:3000'];
  const corsOptions = {
    origin: normalizedAllowedOrigins,
    credentials: true, // Required for cookie-based auth
  };
  app.use(cors(corsOptions));

  // Parse body before rate limiters so req.body.operationName is available
  app.use('/graphql', express.json());

  // Broad limiter — all /graphql traffic
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 500,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { errors: [{ message: 'Too many requests, please try again later.' }] },
  });

  // Tight limiter — only fires for login / register / loginWithGoogle
  const AUTH_OPERATIONS = new Set(['login', 'register', 'loginWithGoogle']);
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => !AUTH_OPERATIONS.has(req.body?.operationName),
    message: { errors: [{ message: 'Too many login attempts. Please try again in 15 minutes.' }] },
  });

  app.use('/graphql', globalLimiter);
  app.use('/graphql', authLimiter);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: !isProduction,
    csrfPrevention: true,
    cache: 'bounded',
    validationRules: [depthLimit(5)],

    context: ({ req }) => {
      // Extract token from Authorization header
      const token = req.headers.authorization || '';

      // Remove 'Bearer' prefix
      const cleanToken = token.replace('Bearer ', '');

      // Verify token and add user to context
      if (cleanToken) {
        try {
          const user = verifyToken(cleanToken);
          return { user };
        } catch (error) {
          console.error('Error verifying token:', error);
          return {};
        }
      }
      return {};
    },
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
    // cors: {
    //     origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    //     credentials: true
    // }
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL API running at http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphQL Playground available`);
  });
}

startServer();
