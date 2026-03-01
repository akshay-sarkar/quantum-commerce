'use client';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAuth } from '@/contexts/AuthContext';
import useCartStore from '@/stores/cartStore';
import { useEffect, useMemo, useRef } from 'react';

const SYNC_CART_MUTATION = gql`
    mutation SyncCart($items: [SyncCartItemInput!]!) {
        syncCart(input: { items: $items }) {
            id
            updatedAt
        }
    }
`;

const GET_MY_CART = gql`
    query GetMyCart {
        myCart {
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

const DEBOUNCE_MS = 700;

export default function CartSyncBridge() {
    const { isAuthenticated } = useAuth();
    const cart = useCartStore((state) => state.cart);
    const setCart = useCartStore((state) => state.setCart);
    const [syncCart] = useMutation(SYNC_CART_MUTATION);

    const isInitialLoadDone = useRef(false);

    const {loading, error, data} = useQuery(GET_MY_CART, {
        skip: !isAuthenticated,
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
      isInitialLoadDone.current = true;
        if (loading) {
            console.log('Loading cart data...');
        }
        if (error) {
            console.error('Error fetching cart:', error);
        }
        if (data) {
          console.log('Fetched cart data:', data);
          const product = [];
          //setCart(data?.myCart?.items ?? []);
          for (const item of data?.myCart?.items ?? []) {
            product.push({
              ...item.product,
              quantity: item.quantity
            });
          }
          setCart(product);
        }

        return () => {
            isInitialLoadDone.current = false;
        };
    }, [loading, error, data]);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const snapshot = useMemo(
        () =>
            JSON.stringify(
                cart
                    .map((item) => ({
                        productId: item.id,
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
