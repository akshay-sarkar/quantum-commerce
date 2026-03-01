
import ProductModel from '../../models/Product';
import UserModel from '../../models/User';
import CartModel from '../../models/Cart';
import { comparePassword, generateToken, hashPassword } from '../../utils/auth';
import mongoose from 'mongoose';

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

const buildCartResponse = async (cart: any) => {
    const cartItems = await Promise.all(
        cart.items.map(async (item: any) => {
            const rawProductId =
                typeof item.productId === 'object' && item.productId !== null
                    ? (item.productId.id ?? item.productId._id?.toString())
                    : item.productId;

            try {
                const product = await findProductByIdentifier(rawProductId);
                if (!product) return null;

                return {
                    productId: product.id ?? product._id.toString(),
                    product,
                    quantity: item.quantity,
                    itemTotal: product.price * item.quantity
                };
            } catch (e) {
                console.error(`Error loading product ${rawProductId}:`, e);
                return null;
            }
        })
    );

    const validItems = cartItems.filter((item: any) => item !== null);
    const itemCount = validItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const subtotal = validItems.reduce((sum: number, item: any) => sum + item.itemTotal, 0);

    return {
        id: cart._id,
        userId: cart.userId,
        items: validItems,
        itemCount,
        subtotal,
        updatedAt: cart.updatedAt
    };
};

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
          const cart = await CartModel.findOne({ userId: context.user.userId });
          if (!cart) return null;

          let response = await buildCartResponse(cart);
          console.log('Built cart response:', response);
          return response;
      }
  },
  Mutation: {
      register: async (parent: any, { input }: any) => {
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
              user
          };
      },

      // addToCart: async (parent: any, { productId, quantity }: any, context: any) => {
      //     if (!context.user) {
      //         throw new Error('Not Authorized');
      //     }
      //     //Validate Quantity
      //     if (quantity <= 0) {
      //         throw new Error('Quantity needs to be greater than 0');
      //     }

      //     // Check if product exist and has enough inventory
      //     const product = await ProductModel.findById(productId);
      //     if (!product) {
      //         throw new Error('Product not found');
      //     }

      //     if (product.inventory < quantity) {
      //         throw new Error(`Only ${product.inventory} items available in stock`);
      //     }

      //     // Find or create cart
      //     let cart = await CartModel.findOne({ userId: context.user.userId });
      //     if (!cart) {
      //         cart = await CartModel.create({ userId: context.user.userId, items: [] });
      //     }

      //     // Check if product already in cart
      //     const existingItemIndex = cart.items.findIndex(
      //         item => item.productId.toString() === productId
      //     );

      //     if (existingItemIndex > -1) {
      //         // Update existing item quantity
      //         const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      //         // Check if new quantity exceeds inventory
      //         if (newQuantity > product.inventory) {
      //             throw new Error(`Cannot add ${quantity} more. Only ${product.inventory - cart.items[existingItemIndex].quantity} more available`);
      //         }

      //         cart.items[existingItemIndex].quantity = newQuantity;
      //     } else {
      //         // Add new item to cart
      //         cart.items.push({ productId, quantity });
      //     }

      //     cart.updatedAt = new Date();
      //     await cart.save();

      //     // Puplulate product details before retunrning
      //     await cart.populate('items.productId');
      //     return cart;
      // },

      // updateCartItem: async (parent: any, { productId, quantity }: any, context: any) => {

      //     if (!context.user) {
      //         throw new Error('Not authenticated');
      //     }

      //     if (quantity <= 0) {
      //         throw new Error('Quantity must be greater than 0');
      //     }

      //     const cart = await CartModel.findOne({ userId: context.user.userId });
      //     if (!cart) {
      //         throw new Error('Cart not found');
      //     }

      //     // Check inventory
      //     const product = await ProductModel.findById(productId);
      //     if (!product) {
      //         throw new Error('Product not found');
      //     }

      //     if (product.inventory < quantity) {
      //         throw new Error(`Only ${product.inventory} items available`);
      //     }

      //     // Find and update item
      //     const itemIndex = cart.items.findIndex(
      //         item => item.productId.toString() === productId
      //     );

      //     if (itemIndex === -1) {
      //         throw new Error('Product not in cart');
      //     }

      //     cart.items[itemIndex].quantity = quantity;
      //     cart.updatedAt = new Date();
      //     await cart.save();

      //     await cart.populate('items.productId');
      //     return cart;
      // },

      // removeFromCart: async (parent: any, { productId }: any, context: any) => {
      //     if (!context.user) {
      //         throw new Error('Not authenticated');
      //     }

      //     const cart = await CartModel.findOne({ userId: context.user.userId });
      //     if (!cart) {
      //         throw new Error('Cart not found');
      //     }

      //     // Remove item
      //     cart.items = cart.items.filter(
      //         item => item.productId.toString() !== productId
      //     );

      //     cart.updatedAt = new Date();
      //     await cart.save();

      //     await cart.populate('items.productId');
      //     return cart;
      // },

      // clearCart: async (parent: any, __: any, context: any) => {
      //     if (!context.user) {
      //         throw new Error('Not authenticated');
      //     }

      //     const cart = await CartModel.findOne({ userId: context.user.userId });
      //     if (!cart) {
      //         throw new Error('Cart not found');
      //     }

      //     cart.items = [];
      //     cart.updatedAt = new Date();
      //     await cart.save();

      //     return cart;
      // },
      
      syncCart: async (parent: any, { input }: any, context: any) => {
          // Check if user is authenticated
          if (!context.user) {
              throw new Error('Not authenticated');
          }
          const { items } = input;

          //Fetch User Id and Cart
          const userId = context.user.userId;
          const cart = await CartModel.findOneAndUpdate({ userId }, { items, updatedAt: new Date() }, { upsert: true, new: true });
          return buildCartResponse(cart);
      }
  },
  //-- Resolvers
  User: {
      id: (parent: any) => parent._id,
      createdAt: (parent: any) => parent.createdAt.toISOString(),
  },
  Cart: {
      id: (parent: any) => parent.id ?? parent._id,
      itemCount: (parent: any) => {
          if (typeof parent.itemCount === 'number') {
              return parent.itemCount;
          }
          return parent.items.reduce((total: number, item: any) => total + item.quantity, 0);
      },
      subtotal: (parent: any) => {
          if (typeof parent.subtotal === 'number') {
              return parent.subtotal;
          }
          return parent.items.reduce((total: number, item: any) => {
              const price = item.product?.price ?? item.productId?.price ?? 0;
              return total + (price * item.quantity);
          }, 0);
      },
      updatedAt: (parent: any) => parent.updatedAt.toISOString()
  },

  CartItem: {
      product: (parent: any) => parent.product ?? parent.productId,
      productId: (parent: any) => {
          if (typeof parent.productId === 'string') {
              return parent.productId;
          }
          if (parent.product?.id) {
              return parent.product.id;
          }
          if (parent.productId?.id) {
              return parent.productId.id;
          }
          return parent.productId?._id?.toString();
      },
      itemTotal: (parent: any) => {
          if (typeof parent.itemTotal === 'number') {
              return parent.itemTotal;
          }
          const price = parent.product?.price ?? parent.productId?.price ?? 0;
          return price * parent.quantity;
      }
  }
};

export default resolvers;
