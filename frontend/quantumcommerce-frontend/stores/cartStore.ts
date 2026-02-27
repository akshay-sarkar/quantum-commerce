"use client";

import { ICartItem, IProduct } from '@/models';
import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ICartState {
    cart: ICartItem[];
    saveForLaterCart: ICartItem[];
    addToSaveForLater: (product: ICartItem) => void;
    removeFromSaveForLater: (productId: string) => void;
    clearSaveForLater: () => void;
    moveToCart: (productId: string) => void;
    addToCart: (product: IProduct, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, qty: number) => void;
    clearCart: () => void;
    totalPrice: () => number;
    existingItemQuantity: (productId: string) => number;
}

const useCartStore = create<ICartState>()(
    persist(
        (set, get) => ({
            cart: [] as ICartItem[],
            saveForLaterCart: [] as ICartItem[],
            addToSaveForLater: (product: ICartItem) => set((state) => {
                const doExist = state.saveForLaterCart.find((item: ICartItem) => item.id === product.id);
                const updatedCart = state.cart.filter((item: ICartItem) => item.id !== product.id);
                if (doExist) {
                    return { saveForLaterCart: state.saveForLaterCart };
                }
                return { saveForLaterCart: [...state.saveForLaterCart, product], cart: updatedCart };
            }),
            removeFromSaveForLater: (productId: string) => set((state) => ({
                saveForLaterCart: state.saveForLaterCart.filter((item: ICartItem) => item.id !== productId)
            })),
            clearSaveForLater: () => set({ saveForLaterCart: [] }),
            moveToCart: (productId: string) => set((state) => {
                const existingItem = state.saveForLaterCart.find((item: ICartItem) => item.id === productId);
                if (existingItem) {
                    return {
                        cart: [...state.cart, existingItem],
                    };
                } else {
                    return { cart: state.cart };
                }
            }),
            addToCart: (product: IProduct, qty?: number) => set((state) => {
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
            updateQuantity: (productId: string, qty: number) => set((state) => {
                if (qty <= 0) {
                    return { cart: state.cart.filter((item: ICartItem) => item.id !== productId) };
                }
                return {
                    cart: state.cart.map((item: ICartItem) =>
                        item.id === productId ? { ...item, quantity: qty } : item
                    )
                };
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
        }),
    {
      name: 'quantumcommerce-storage', // unique name for the item in local storage
      storage: createJSONStorage(() => localStorage) // default is localStorage
    }));

export default useCartStore;