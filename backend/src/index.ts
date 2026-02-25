import express from "express";
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import ProductModel from './models/Product';
import { connectDB } from './config/database';
import UserModel from './models/User';
import CartModel from "./models/Cart";
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
        myCart: Cart
    }
    type Mutation {
        register(input: RegisterInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        addToCart(productId: ID!, quantity: Int!): Cart
        updateCartItem(productId: ID!, quantity: Int!): Cart
        removeFromCart(productId: ID!): Cart
        clearCart: Cart
    }
    type SystemStatus {
        status: String,
        timestamp: String,
        database: String
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
    type AuthPayload {
        token: String!,
        user: User!
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
        isActive: Boolean!
    }
    type Address {
        id: ID!
        street: String!
        city: String!
        state: String!
        zip: String!
        country: String!
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
    type Cart {
        id: ID!,
        userId: ID!,
        items: [CartItem!]!,
        itemCount: Int!,
        subtotal: Float!
        updatedAt: String!
    }
    type CartItem {
        product: Product!,
        quantity: Int!,
        itemTotal: Float!
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
                throw new Error('Not Authorized');
            }
            return await UserModel.findById(context.user.userId);
        },
        myCart: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Not Authenticated');
            }

            // Find or create a cart
            const cart = await CartModel.findOne({ userId: context.user.userId }).populate('items.productId');

            if (!cart) {
                await CartModel.findOne({ userId: context.user.userId, items: [] });
            }
            return cart;
        }
    },
    Mutation: {
        register: async (_: any, { input }: any) => {
            const { email, password, firstName, lastName } = input;

            // Check if the user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists with this email');
            }
            // Hash password
            const hashedPassword = await hashPassword(password);
            const user = await UserModel.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                userType: 'BUYER',
                createdAt: new Date()
            });

            // Generate token
            const token = generateToken(user);

            return {
                token,
                user
            };
        },

        // login User
        login: async (_: any, { input }: any) => {
            const { email, password } = input;

            // Find user
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Verify password
            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }

            // Generate token
            const token = generateToken(user);

            return {
                token,
                user
            };
        },

        addToCart: async (_: any, { productId, quantity }: any, context: any) => {
            if (!context.user) {
                throw new Error('Not Authorized');
            }
            //Validate Quantity
            if (quantity <= 0) {
                throw new Error('Quantity needs to be greater than 0');
            }

            // Check if product exist and has enough inventory
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            if (product.inventory < quantity) {
                throw new Error(`Only ${product.inventory} items available in stock`);
            }

            // Find or create cart
            let cart = await CartModel.findOne({ userId: context.user.userId });
            if (!cart) {
                cart = await CartModel.create({ userId: context.user.userId, items: [] });
            }

            // Check if product already in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (existingItemIndex > -1) {
                // Update existing item quantity
                const newQuantity = cart.items[existingItemIndex].quantity + quantity;

                // Check if new quantity exceeds inventory
                if (newQuantity > product.inventory) {
                    throw new Error(`Cannot add ${quantity} more. Only ${product.inventory - cart.items[existingItemIndex].quantity} more available`);
                }

                cart.items[existingItemIndex].quantity = newQuantity;
            } else {
                // Add new item to cart
                cart.items.push({ productId, quantity });
            }

            cart.updatedAt = new Date();
            await cart.save();

            // Puplulate product details before retunrning
            await cart.populate('items.productId');
            return cart;
        },

        updateCartItem: async (_: any, { productId, quantity }: any, context: any) => {

            if (!context.user) {
                throw new Error('Not authenticated');
            }

            if (quantity <= 0) {
                throw new Error('Quantity must be greater than 0');
            }

            const cart = await CartModel.findOne({ userId: context.user.userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Check inventory
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            if (product.inventory < quantity) {
                throw new Error(`Only ${product.inventory} items available`);
            }

            // Find and update item
            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );

            if (itemIndex === -1) {
                throw new Error('Product not in cart');
            }

            cart.items[itemIndex].quantity = quantity;
            cart.updatedAt = new Date();
            await cart.save();

            await cart.populate('items.productId');
            return cart;
        },

        removeFromCart: async (_: any, { productId }: any, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            const cart = await CartModel.findOne({ userId: context.user.userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Remove item
            cart.items = cart.items.filter(
                item => item.productId.toString() !== productId
            );

            cart.updatedAt = new Date();
            await cart.save();

            await cart.populate('items.productId');
            return cart;
        },

        clearCart: async (_: any, __: any, context: any) => {
            if (!context.user) {
                throw new Error('Not authenticated');
            }

            const cart = await CartModel.findOne({ userId: context.user.userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.items = [];
            cart.updatedAt = new Date();
            await cart.save();

            return cart;
        }

    },
    //-- Resolvers
    User: {
        id: (parent: any) => parent._id,
        createdAt: (parent: any) => parent.createdAt.toISOString(),
    },
    Cart: {
        id: (parent: any) => parent._id,
        itemCount: (parent: any) => {
            return parent.items.reduce((total: number, item: any) => total + item.quantity, 0);
        },
        subtotal: (parent: any) => {
            return parent.items.reduce((total: number, item: any) => {
                const price = item.productId.price;
                return total + (price * item.quantity);
            }, 0);
        },
        updatedAt: (parent: any) => parent.updatedAt.toISOString()
    },

    CartItem: {
        product: (parent: any) => parent.productId,
        itemTotal: (parent: any) => {
            return parent.productId.price * parent.quantity;
        }
    }
};

async function startServer() {
    await connectDB();

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

            // Verify toekn and add user to context
            if (cleanToken) {
                try {
                    const user = verifyToken(cleanToken);
                    return { user };
                } catch (error) {
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
        cors: {
            origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true
        }
    });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`🚀 GraphQL API running at http://localhost:${PORT}/graphql`);
        console.log(`📊 GraphQL Playground available`);
    });
}

startServer();