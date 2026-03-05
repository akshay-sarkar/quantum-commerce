import ProductModel from '../../models/Product';
import UserModel from '../../models/User';
import CartModel from '../../models/Cart';
import { comparePassword, generateToken, hashPassword } from '../../utils/auth';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const findProductByIdentifier = async (identifier: unknown) => {
  if (identifier === null || identifier === undefined) {
    return null;
  }

  const value = String(identifier);

  // Prefer domain-level product id (e.g. "1", "2"), then fallback to Mongo _id.
  const byCustomId = await ProductModel.findOne({ id: value });
  if (byCustomId) {
    return byCustomId;
  }

  if (!mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }

  return ProductModel.findById(value);
};

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    systemStatus: () => ({
      status: 'running',
      timestamp: new Date().toISOString(),
      database: 'MongoDB Atlas',
    }),
    products: async () => {
      return await ProductModel.find();
    },
    product: async (parent: any, { id }: { id: string }) => {
      return await findProductByIdentifier(id);
    },
    me: async (parent: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error('Not Authorized');
      }
      return await UserModel.findById(context.user.userId);
    },
    myCart: async (parent: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error('Not Authenticated');
      }
      return await CartModel.findOne({ userId: context.user.userId }).populate(
        'items.product'
      );
    },
  },
  Mutation: {
    register: async (parent: any, { input }: any) => {
      const { email, password, firstName, lastName } = input;

      // Validate input
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      if (!firstName || firstName.trim() === '') {
        throw new Error('First name is required');
      }

      if (!lastName || lastName.trim() === '') {
        throw new Error('Last name is required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Password complexity: at least one letter and one number
      if (!/^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
        throw new Error(
          'Password must contain at least one letter and one number'
        );
      }

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
        createdAt: new Date(),
      });

      // Generate token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },

    // login User
    login: async (parent: any, { input }: any) => {
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
        user,
      };
    },

    syncCart: async (parent: any, { input }: any, context: any) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const { items } = input;

      const dbItems = await Promise.all(
        items.map(async (item: any) => {
          const product = await findProductByIdentifier(item.productId);
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }
          return {
            product: product._id,
            quantity: item.quantity,
          };
        })
      );

      //Fetch User Id and Cart
      const userId = context.user.userId;
      const cart = await CartModel.findOneAndUpdate(
        { userId },
        { items: dbItems, updatedAt: new Date() },
        { upsert: true, new: true }
      ).populate('items.product');
      return cart;
    },

    loginWithGoogle: async (parent: any, { idToken }: any) => {
      // Verify idToken with google-auth-library
      if (!GOOGLE_CLIENT_ID) {
        throw new Error('Google Client ID not configured');
      }
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      // Validate required claims
      if (!payload) {
        throw new Error('Invalid token payload');
      }
      if (payload.aud !== GOOGLE_CLIENT_ID) {
        throw new Error('Token audience mismatch');
      }

      if (
        payload.iss !== 'https://accounts.google.com' &&
        payload.iss !== 'accounts.google.com'
      ) {
        throw new Error('Invalid token issuer');
      }

      if (!payload.email_verified) {
        throw new Error('Email not verified by Google');
      }

      const email = payload.email;
      if (!email) {
        throw new Error('No email in token');
      }

      // Find or create user
      let user = await UserModel.findOne({ email });

      if (!user) {
        // Create new user for Google OAuth (no password needed)
        user = await UserModel.create({
          email,
          password: undefined, // OAuth users don't need passwords
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          userType: 'BUYER',
          createdAt: new Date(),
        });
      }
      // Generate token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },
  //-- Resolvers
  User: {
    id: (parent: any) => parent._id,
    createdAt: (parent: any) => parent.createdAt.toISOString(),
  },
  Product: {
    id: (parent: any) => parent.id || parent._id?.toString(),
  },
  Cart: {
    updatedAt: (parent: any) => parent.updatedAt.toISOString(),
  },

  CartItem: {
    product: (parent: any) => parent.product ?? parent.productId,
  },
};

export default resolvers;
