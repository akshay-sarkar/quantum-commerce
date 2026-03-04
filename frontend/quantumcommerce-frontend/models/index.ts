export interface IProduct {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    inventory: number;
    imageUrl: string;
}

export interface IUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    userType: string;
}

export interface IAddress{
    userId: IUser["id"];
    street: string,
    city: string,
    state: string,
    zip: string,
    country: string
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
}

export interface ICart {
    id: string;
    userId: IUser["id"];
    items: ICartItem[];
    updatedAt: string;
}