import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      description
      category
      inventory
      imageUrl
    }
  }
`;

export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
      id
      userId
      updatedAt
      items {
        quantity
        product {
          id
          name
          description
          price
          category
          imageUrl
        }
      }
      savedForLaterItems {
        quantity
        product {
          id
          name
          description
          price
          category
          imageUrl
        }
      }
    }
  }
`;

// Mutation
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        userType
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        userType
      }
    }
  }
`;

export const SYNC_CART_MUTATION = gql`
  mutation SyncCart($items: [SyncCartItemInput!]!, $savedForLaterItems: [SyncCartItemInput!]) {
    syncCart(input: { items: $items, savedForLaterItems: $savedForLaterItems }) {
      id
      updatedAt
    }
  }
`;

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($idToken: String!) {
    loginWithGoogle(idToken: $idToken) {
      token
      user {
        id
        email
        firstName
        lastName
        userType
      }
    }
  }
`;

// ── Admin ────────────────────────────────────────────────────────────────────

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      firstName
      lastName
      userType
      createdAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      inventory
      category
      imageUrl
      isActive
      createdAt
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      inventory
      category
      imageUrl
      isActive
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      userType
      createdAt
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
