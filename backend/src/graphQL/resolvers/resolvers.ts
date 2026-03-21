import ProductModel from '../../models/Product';
import UserModel from '../../models/User';
import CartModel from '../../models/Cart';
import AddressModel from '../../models/Address';
import { comparePassword, generateToken, hashPassword } from '../../utils/auth';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationError } from 'apollo-server-express';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();

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
      return await CartModel.findOne({ userId: context.user.userId }).populate([
        'items.product',
        'savedForLaterItems.product',
      ]);
    },
    myAddresses: async (parent: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      return AddressModel.find({ userId: context.user.userId });
    },
    users: async (parent: any, __: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (context.user.userType !== 'ADMIN') {
        throw new AuthenticationError('Not authorized. Admin access required.');
      }
      return await UserModel.find().sort({ createdAt: -1 });
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

      // Block OAuth accounts from password-based login
      if (user.userType === 'G_BUYER') {
        throw new AuthenticationError('This account uses Google Sign-In. Please log in with Google.');
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
      const { items, savedForLaterItems = [] } = input;

      const MAX_CART_ITEMS = 100;
      if (items.length > MAX_CART_ITEMS || savedForLaterItems.length > MAX_CART_ITEMS) {
        throw new Error(`Cart cannot exceed ${MAX_CART_ITEMS} items`);
      }

      const toDbItems = async (rawItems: any[]) =>
        Promise.all(
          rawItems.map(async (item: any) => {
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) {
              throw new Error(`Invalid quantity for product ${item.productId}. Must be between 1 and 100.`);
            }
            const product = await findProductByIdentifier(item.productId);
            if (!product) {
              throw new Error(`Product not found: ${item.productId}`);
            }
            return { product: product._id, quantity: item.quantity };
          })
        );

      const [dbItems, dbSavedItems] = await Promise.all([
        toDbItems(items),
        toDbItems(savedForLaterItems),
      ]);

      //Fetch User Id and Cart
      const userId = context.user.userId;
      const cart = await CartModel.findOneAndUpdate(
        { userId },
        { items: dbItems, savedForLaterItems: dbSavedItems, updatedAt: new Date() },
        { upsert: true, new: true }
      ).populate(['items.product', 'savedForLaterItems.product']);
      return cart;
    },

    loginWithGoogle: async (parent: any, { idToken }: any) => {
      // Verify idToken with google-auth-library
      if (!GOOGLE_CLIENT_ID) {
        throw new Error('Google Client ID not configured');
      }
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);

      let ticket;
      try {
        ticket = await client.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID,
        });
      } catch (error: any) {
        console.error('Google verification failed:', error.message);
        throw new AuthenticationError('Google login failed. Please try again.');
      }

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
        // Create new Google OAuth user with a random, unrecoverable password hash
        const hashedPassword = await hashPassword(crypto.randomBytes(32).toString('hex'));
        user = await UserModel.create({
          email,
          password: hashedPassword,
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          userType: 'G_BUYER',
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

    saveAddress: async (parent: any, { input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      const { street, city, state, zip, country } = input;
      if (!street?.trim()) throw new Error('Street is required');
      if (!city?.trim()) throw new Error('City is required');
      if (!state?.trim()) throw new Error('State is required');
      if (!zip?.trim()) throw new Error('ZIP code is required');
      if (!country?.trim()) throw new Error('Country is required');
      if (country.trim() === 'US' && !/^\d{5}$/.test(zip.trim())) {
        throw new Error('US ZIP code must be exactly 5 digits');
      }
      if (country.trim() === 'CA' && !/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(zip.trim())) {
        throw new Error('Canadian postal code must be in the format A1A 1A1');
      }

      return AddressModel.create({
        userId: context.user.userId,
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        country: country.trim(),
      });
    },

    deleteAddress: async (parent: any, { id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      const deleted = await AddressModel.findOneAndDelete({
        _id: id,
        userId: context.user.userId,
      });
      if (!deleted) throw new Error('Address not found or does not belong to you');
      return true;
    },

    createProduct: async (parent: any, { input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (context.user.userType !== 'ADMIN') {
        throw new AuthenticationError('Not authorized. Admin access required.');
      }

      const { name, description, price, inventory, category, imageUrl, isActive } = input;

      const allowedCategories = ['Electronics', 'Clothing', 'Books', 'Furniture'];
      if (!allowedCategories.includes(category)) {
        throw new Error(`Invalid category. Must be one of: ${allowedCategories.join(', ')}`);
      }
      if (!name || name.trim() === '') {
        throw new Error('Product name is required');
      }
      if (!description || description.trim() === '') {
        throw new Error('Product description is required');
      }
      if (price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      if (!Number.isInteger(inventory) || inventory < 0) {
        throw new Error('Inventory must be a non-negative integer');
      }
      if (!imageUrl || imageUrl.trim() === '') {
        throw new Error('Image URL is required');
      }

      const customId = crypto.randomUUID();

      const product = await ProductModel.create({
        id: customId,
        name: name.trim(),
        description: description.trim(),
        price,
        inventory,
        category,
        imageUrl: imageUrl.trim(),
        isActive: isActive ?? true,
        addedBy: context.user.userId,
        createdAt: new Date(),
      });

      return product;
    },

    updateProduct: async (parent: any, { id, input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (context.user.userType !== 'ADMIN') {
        throw new AuthenticationError('Not authorized. Admin access required.');
      }

      const product = await findProductByIdentifier(id);
      if (!product) {
        throw new Error(`Product not found: ${id}`);
      }

      const allowedCategories = ['Electronics', 'Clothing', 'Books', 'Furniture'];
      if (input.category && !allowedCategories.includes(input.category)) {
        throw new Error(`Invalid category. Must be one of: ${allowedCategories.join(', ')}`);
      }
      if (input.price !== undefined && input.price <= 0) {
        throw new Error('Price must be greater than 0');
      }
      if (input.inventory !== undefined && (!Number.isInteger(input.inventory) || input.inventory < 0)) {
        throw new Error('Inventory must be a non-negative integer');
      }

      const updates: Record<string, any> = {};
      if (input.name !== undefined) updates.name = input.name.trim();
      if (input.description !== undefined) updates.description = input.description.trim();
      if (input.price !== undefined) updates.price = input.price;
      if (input.inventory !== undefined) updates.inventory = input.inventory;
      if (input.category !== undefined) updates.category = input.category;
      if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl.trim();
      if (input.isActive !== undefined) updates.isActive = input.isActive;

      return await ProductModel.findByIdAndUpdate(product._id, updates, { new: true });
    },

    deleteProduct: async (parent: any, { id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (context.user.userType !== 'ADMIN') {
        throw new AuthenticationError('Not authorized. Admin access required.');
      }

      const product = await findProductByIdentifier(id);
      if (!product) {
        throw new Error(`Product not found: ${id}`);
      }

      await ProductModel.findByIdAndDelete(product._id);
      return true;
    },

    updateUser: async (parent: any, { id, input }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (context.user.userType !== 'ADMIN') {
        throw new AuthenticationError('Not authorized. Admin access required.');
      }

      const allowedUserTypes = ['BUYER', 'ADMIN', 'G_BUYER'];
      if (input.userType && !allowedUserTypes.includes(input.userType)) {
        throw new Error(`Invalid userType. Must be one of: ${allowedUserTypes.join(', ')}`);
      }

      if (input.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          throw new Error('Invalid email format');
        }
        const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
        if (existing && existing._id.toString() !== id) {
          throw new Error('Email already in use by another account');
        }
      }

      const updates: Record<string, any> = {};
      if (input.firstName !== undefined) updates.firstName = input.firstName.trim();
      if (input.lastName !== undefined) updates.lastName = input.lastName.trim();
      if (input.email !== undefined) updates.email = input.email.toLowerCase().trim();
      if (input.userType !== undefined) updates.userType = input.userType;

      const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
      if (!user) {
        throw new Error(`User not found: ${id}`);
      }
      return user;
    },

    deleteUser: async (parent: any, { id }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not authenticated');
      }
      if (context.user.userType !== 'ADMIN') {
        throw new AuthenticationError('Not authorized. Admin access required.');
      }
      if (context.user.userId === id) {
        throw new Error('Cannot delete your own admin account');
      }

      const user = await UserModel.findByIdAndDelete(id);
      if (!user) {
        throw new Error(`User not found: ${id}`);
      }
      return true;
    },
  },
  //-- Resolvers
  User: {
    id: (parent: any) => parent._id,
    createdAt: (parent: any) => parent.createdAt.toISOString(),
  },
  Address: {
    id: (parent: any) => parent._id,
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
