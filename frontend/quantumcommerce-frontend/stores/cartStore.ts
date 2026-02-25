"use client";

import { ICartItem, IProduct } from '@/models';
import {create} from 'zustand';

interface ICartState {
    cart: ICartItem[];
    addToCart: (product: IProduct, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    totalPrice: () => number;
    existingItemQuantity: (productId: string) => number;
}

const useCartStore = create<ICartState>((set, get) => ({
    cart: [] as ICartItem[],
    addToCart: (product: IProduct, qty?: number) => set((state) => {
        console.log(product.id);
        const existingItem = state.cart.find((item: ICartItem) => item.id === product.id);
        if (existingItem) {
            return {
                cart: state.cart.map((item: ICartItem) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + (qty || 0) } : item
                )
            };
        } else {
            return { cart: [...state.cart, { ...product, quantity: qty || 1 }] };
        }
    }),
    removeFromCart: (productId: string) => set((state) => ({
        cart: state.cart.filter((item: ICartItem) => item.id !== productId)
    })),
    clearCart: () => set({ cart: [] }),
    totalPrice: () => get().cart.reduce((total: number, item: ICartItem) => total + (item.price * item.quantity), 0),
    existingItemQuantity: (productId: string) =>  {
        const existingItem = get().cart.find((item: ICartItem) => item.id === productId);
        return existingItem ? existingItem.quantity : 0;
    }
}));

export default useCartStore;