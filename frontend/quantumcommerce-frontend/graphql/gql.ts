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
