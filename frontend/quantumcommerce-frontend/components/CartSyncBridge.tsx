'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { useAuth } from '@/contexts/AuthContext';
import useCartStore from '@/stores/cartStore';
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { ICartItem } from '@/models';
import { GET_MY_CART, SYNC_CART_MUTATION } from '@/graphql/gql';
import { c } from '@apollo/client/react/internal/compiler-runtime';

interface GetMyCartResponse {
    myCart: {
        items: ICartItem[];
        id: string;
        updatedAt: string;
        userId: string;
    };
}


const DEBOUNCE_MS = 700;

export default function CartSyncBridge() {
    const { isAuthenticated } = useAuth();
    const cart = useCartStore((state) => state.cart);
    const setCart = useCartStore((state) => state.setCart);
    const [syncCart] = useMutation(SYNC_CART_MUTATION);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialLoadDone = useRef(false);
    const lastSyncedSnapshot = useRef<string>('');

    const {loading, error, data} = useQuery<GetMyCartResponse>(GET_MY_CART, {
        skip: !isAuthenticated,
        fetchPolicy: 'network-only'
    });

    const generateSnapshot = useCallback((items: ICartItem[]) => {
        if (!items || items.length === 0) {
            return '[]';
        }
        return JSON.stringify(
            items.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
            })).sort((a: any, b: any) => a.productId.localeCompare(b.productId))
        );
    }, []);

    useEffect(() => {
        console.log('CartSyncBridge useEffect - loading:', loading, 'error:', error, 'data:', data);
        if (isInitialLoadDone.current) {
            return;
        }
        if (loading) {
            console.log('Loading cart data...');
            return;
        }
        if (error || data?.myCart === null) {
            console.error('Error fetching cart:', error);
            isInitialLoadDone.current = true;
        }
        if (data?.myCart) {
          console.log('Fetched cart data:', data);
          // Prevent immediate sync back of the data we just fetched
          const serverSnapshot = generateSnapshot(data.myCart.items);
          lastSyncedSnapshot.current = serverSnapshot;

          setCart(data.myCart);
          isInitialLoadDone.current = true;
        }
    }, [loading, error, data, setCart, generateSnapshot]);


    const snapshot = useMemo(
        () => generateSnapshot(cart?.items || []),
        [cart, generateSnapshot],
    );

    useEffect(() => {
        console.log('Cart snapshot changed:', snapshot);
        if (!isAuthenticated) {
            return;
        }

        if (!isInitialLoadDone.current) {
            return;
        }

        // If the current snapshot matches what we last synced (or loaded), skip
        if (snapshot === lastSyncedSnapshot.current) {
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            try {
                await syncCart({
                    variables: {
                        items: JSON.parse(snapshot),
                    },
                });
                lastSyncedSnapshot.current = snapshot;
            } catch (error) {
                console.error('Cart sync failed:', error);
            }
        }, DEBOUNCE_MS);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isAuthenticated, snapshot, syncCart]);

    return null;
}
