export interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  inventory: number;
  imageUrl: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  userType: string;
}

export interface IAddress {
  userId: IUser["id"];
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICart {
  id: string;
  userId: IUser["id"];
  items: ICartItem[];
  savedForLaterItems: ICartItem[];
  updatedAt: string;
}

export interface IGoogleLoginResponse {
  loginWithGoogle: {
    token: string;
    user: IUser;
  };
}

// Response Types

export interface IUserResponse {
  token: string;
  user: IUser;
}

export interface ILoginResponse {
  login: IUserResponse;
}

export interface IRegisterResponse {
  register: IUserResponse;
}

// Admin
export interface IGetUsersResponse {
  users: IUser[];
}
export interface ICreateProductResponse {
  createProduct: IProduct;
}
export interface IUpdateUserResponse {
  updateUser: IUser;
}
export interface IDeleteUserResponse {
  deleteUser: boolean;
}

// Context Creation
export interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: IUser | null) => void;
  handleGoogleLogin: (idToken: string) => Promise<void>;
}
