import express from "express";
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import ProductModel from './models/Product';
import { connectDB } from './config/database';
import UserModel from './models/User';
import { comparePassword, generateToken, hashPassword, verifyToken } from './utils/auth';

dotenv.config();

const app = express();

const typeDefs = `
    type Query {
        hello: String,
        systemStatus: SystemStatus,
        products: [Product!]!,
        product(id: ID!): Product,
        me: User,
    }
    type Mutation {
        register(input: RegisterInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
    }
    type SystemStatus {
        status: String,
        timestamp: String,
        database: String
    }
    type Product {
        id: ID!,
        name: String!,
        description: String!,
        price: Float!,
        inventory: Int!,
        category: String!,
        imageUrl: String!,
        createdAt: String!,
        addedBy: User!
    }
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        createdAt: String!
        userType: String!
        address: [Address!]!
    }
    type Address {
        id: ID!
        street: String!
        city: String!
        state: String!
        zip: String!
        country: String!
    }
    type AuthPayload {
        token: String!,
        user: User!
    }
    type AuthPayload{
        token: String!,
        user: User!
    }
    input RegisterInput {
        email: String!,
        password: String!,
        firstName: String!,
        lastName: String!
    }
  input LoginInput {
    email: String!
    password: String!
  }
`;

const resolvers = {
    Query: {
        hello: () => "Hello World",
        systemStatus: () => ({
            status: "running",
            timestamp: new Date().toISOString(),
            database: "MongoDB Atlas"
        }),
        products: async () => {
            return await ProductModel.find();
        },
        product: async (_: any, { id }: { id: string }) => {
            return await ProductModel.findById(id);
        },
        me: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('NOt Authorized');
            }
            await UserModel.findById(context.user.userId);
        }
    },
    User: {
        id: (parent: any) => parent._id,
        createdAt: (parent: any) => parent.createdAt.toISOString(),
    },
};

async function startServer() {
    await connectDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        csrfPrevention: true,
        cache: 'bounded'
    });

    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`🚀 GraphQL API running at http://localhost:${PORT}/graphql`);
        console.log(`📊 GraphQL Playground available`);
    });
}

startServer();