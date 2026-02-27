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

export interface ICartItem extends IProduct {
    quantity: number;
}

export interface ICart {
    id: string;
    items: ICartItem[];
    itemCount: number;
    subtotal: number;
    updatedAt: string;
    isSycing?: boolean;
    syncError?: string;
}