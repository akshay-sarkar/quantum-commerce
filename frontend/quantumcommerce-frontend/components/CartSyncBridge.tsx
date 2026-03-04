'use client';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAuth } from '@/contexts/AuthContext';
import useCartStore from '@/stores/cartStore';
import { useEffect, useMemo, useRef } from 'react';
import { ICart, ICartItem } from '@/models';
import { c } from '@apollo/client/react/internal/compiler-runtime';

const SYNC_CART_MUTATION = gql`
    mutation SyncCart($items: [SyncCartItemInput!]!) {
        syncCart(input: { items: $items }) {
            id
            updatedAt
        }
    }
`;

interface GetMyCartResponse {
    myCart: {
        items: ICartItem[];
        id: string;
        updatedAt: string;
        userId: string;
    };
}

const GET_MY_CART = gql`
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
        }
    }
`;

const DEBOUNCE_MS = 5000;

export default function CartSyncBridge() {
    const { isAuthenticated } = useAuth();
    const cart = useCartStore((state) => state.cart);
    const setCart = useCartStore((state) => state.setCart);
    const [syncCart] = useMutation(SYNC_CART_MUTATION);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isInitialLoadDone = useRef(false);

    const {loading, error, data} = useQuery<GetMyCartResponse>(GET_MY_CART, {
        skip: !isAuthenticated,
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (isInitialLoadDone.current) {
            return;
        }
        if (loading) {
            console.log('Loading cart data...');
            return;
        }
        if (error) {
            console.error('Error fetching cart:', error);
            isInitialLoadDone.current = true;
        }
        if (data?.myCart) {
          console.log('Fetched cart data:', data);
          setCart(data.myCart);
          isInitialLoadDone.current = true;
        }
    }, [loading, error, data, setCart]);


    const snapshot = useMemo(
        () =>
            JSON.stringify(
                cart?.items
                    ?.map((item) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                    }))
                    .sort((a, b) => a.productId.localeCompare(b.productId)),
            ),
        [cart],
    );

    useEffect(() => {
        console.log('Cart snapshot changed:', snapshot);
        if (!isAuthenticated) {
            return;
        }

        if (!isInitialLoadDone.current) {
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
