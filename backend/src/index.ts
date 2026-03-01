import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import { connectDB } from './config/database';
import { verifyToken } from './utils/auth';
import typeDefs from './graphQL/typeDefs/typeDefs';
import resolvers from './graphQL/resolvers/resolvers';

async function startServer() {
    const app = express();
    await connectDB();

    // Configure CORS
    const corsOptions = {
        origin: [
        'http://localhost:3000',              // Your frontend URL
        'https://studio.apollographql.com'    // Apollo Studio
        ],
        credentials: true, // Required for cookie-based auth
    };
    app.use(cors(corsOptions));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        csrfPrevention: true,
        cache: 'bounded',

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
        }
    });

    await server.start();
    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: false
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