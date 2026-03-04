"use client";

import { IProduct, ICart, ICartItem } from '@/models';
import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ICartState {
    cart: ICart;
    saveForLaterCart: ICart;
    addToSaveForLater: (cartItem: ICartItem) => void;
    removeFromSaveForLater: (productId: string) => void;
    clearSaveForLater: () => void;
    moveToCart: (cartItem: ICartItem) => void;
    addToCart: (product: IProduct, qty?: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, qty: number) => void;
    clearCart: () => void;
    totalPrice: () => number;
    existingItemQuantity: (productId: string) => number;
    setCart: (cart: ICart) => void;
}

const emptyCart: ICart = { id: '', userId: '', items: [], updatedAt: '' };

const useCartStore = create<ICartState>()(
    persist(
        (set, get) => ({
            cart: emptyCart,
            saveForLaterCart: emptyCart ,
            /* Save for later functionality */
            addToSaveForLater: (cartItem: ICartItem) => set((state) => {
                const doExist = state.saveForLaterCart.items.find((item: ICartItem) => item.product.id === cartItem.product.id);
                const updatedCartItems = state.cart.items.filter((item: ICartItem) => item.product.id !== cartItem.product.id);
                if (doExist) {
                    return { saveForLaterCart: state.saveForLaterCart };
                }
                return {
                    saveForLaterCart: { ...state.saveForLaterCart, items: [...state.saveForLaterCart.items, cartItem] },
                    cart: { ...state.cart, items: updatedCartItems }
                };
            }),
            removeFromSaveForLater: (productId: string) => set((state) => ({
                saveForLaterCart: { ...state.saveForLaterCart, items: state.saveForLaterCart.items.filter((item: ICartItem) => item.product.id !== productId) }
            })),
            clearSaveForLater: () => set({ saveForLaterCart: emptyCart as ICart }),
            moveToCart: (cartItem: ICartItem) => set((state) => {
                const existingItem = state.saveForLaterCart.items.find((item: ICartItem) => item.product.id === cartItem.product.id);
                if (!existingItem) {
                    // return an empty partial so we never return undefined
                    return {} as Partial<ICartState>;
                }
                return {
                    cart: { ...state.cart, items: [...state.cart.items, existingItem] },
                    saveForLaterCart: {
                        ...state.saveForLaterCart,
                        items: state.saveForLaterCart.items.filter(item => item.product.id !== cartItem.product.id)
                    }
                };
            }),
            /* Cart functionality */
            addToCart: (product: IProduct, qty?: number) => set((state) => {
                const quantityToAdd = qty ?? 1;
                const existingItem = state.cart?.items?.length > 0 && state.cart.items.find((item: ICartItem) => item.product.id === product.id);
                if (existingItem) {
                    return {
                        cart: {
                            ...state.cart,
                            items: state.cart.items.map((item: ICartItem) =>
                                item.product.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
                            )
                        }
                    };
                } else {
                    return {
                        cart: {
                            ...state.cart,
                            items: [...state.cart.items, { product, quantity: quantityToAdd }]
                        }
                    };
                }
            }),
            updateQuantity: (productId: string, qty: number) => set((state) => {
                if (qty <= 0) {
                    return { cart: { ...state.cart, items: state.cart.items.filter((item: ICartItem) => item.product.id !== productId) } };
                }
                return {
                    cart: {
                        ...state.cart,
                        items: state.cart.items.map((item: ICartItem) =>
                            item.product.id === productId ? { ...item, quantity: qty } : item
                        )
                    }
                };
            }),
            removeFromCart: (productId: string) => set((state) => ({
                cart: { ...state.cart, items: state.cart.items.filter((item: ICartItem) => item.product.id !== productId) }
            })),
            clearCart: () => set({ cart: emptyCart as ICart }),
            setCart: (cart: ICart) => set({ cart }),
            totalPrice: () => get().cart.items.reduce((total: number, item: ICartItem) => total + (item.product.price * item.quantity), 0),
            existingItemQuantity: (productId: string) =>  {
                const existingItemLength = get().cart?.items?.length > 0;
                if (!existingItemLength) {
                    return 0;
                }
                const existingItem = get().cart.items.find((item: ICartItem) => item.product.id === productId);
                return existingItem ? existingItem.quantity : 0;
            }
        }),
    {
      name: 'quantumcommerce-storage', // unique name for the item in local storage
      storage: createJSONStorage(() => localStorage) // default is localStorage
    }));

export default useCartStore;
