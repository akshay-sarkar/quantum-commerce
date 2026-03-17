const typeDefs = `
    type Query {
        hello: String,
        systemStatus: SystemStatus,
        products: [Product!]!,
        product(id: ID!): Product,
        me: User,
        myCart: Cart,
        users: [User!]!
    }

    type Mutation {
        register(input: RegisterInput!): AuthPayload!
        login(input: LoginInput!): AuthPayload!
        syncCart(input: SyncCartInput!): Cart!
        loginWithGoogle(idToken: String!): AuthPayload!
        createProduct(input: CreateProductInput!): Product!
        updateProduct(id: ID!, input: UpdateProductInput!): Product!
        deleteProduct(id: ID!): Boolean!
        updateUser(id: ID!, input: UpdateUserInput!): User!
        deleteUser(id: ID!): Boolean!
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
        id: String!,
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
    type Cart {
        id: ID!,
        userId: ID!,
        items: [CartItem!]!,
        savedForLaterItems: [CartItem!]!,
        updatedAt: String!
    }
    type CartItem {
        product: Product!,
        quantity: Int!,
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
    input SyncCartItemInput {
        productId: ID!,
        quantity: Int!,
    }
    input SyncCartInput {
        items: [SyncCartItemInput!]!
        savedForLaterItems: [SyncCartItemInput!]
    }
    input CreateProductInput {
        name: String!
        description: String!
        price: Float!
        inventory: Int!
        category: String!
        imageUrl: String!
        isActive: Boolean
    }
    input UpdateProductInput {
        name: String
        description: String
        price: Float
        inventory: Int
        category: String
        imageUrl: String
        isActive: Boolean
    }
    input UpdateUserInput {
        firstName: String
        lastName: String
        email: String
        userType: String
    }
`;

export default typeDefs;
