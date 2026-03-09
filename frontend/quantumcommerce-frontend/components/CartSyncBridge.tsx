"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useAuth } from "@/contexts/AuthContext";
import useCartStore from "@/stores/cartStore";
import { useEffect, useMemo, useRef, useCallback } from "react";
import { ICartItem } from "@/models";
import { GET_MY_CART, SYNC_CART_MUTATION } from "@/graphql/gql";

interface GetMyCartResponse {
  myCart: {
    items: ICartItem[];
    savedForLaterItems: ICartItem[];
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
  const saveForLaterCart = useCartStore((state) => state.saveForLaterCart);
  const setSaveForLaterCart = useCartStore((state) => state.setSaveForLaterCart);
  const [syncCart] = useMutation(SYNC_CART_MUTATION);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoadDone = useRef(false);
  const lastSyncedSnapshot = useRef<string>("");

  const { loading, error, data } = useQuery<GetMyCartResponse>(GET_MY_CART, {
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  const generateSnapshot = useCallback((items: ICartItem[]) => {
    if (!items || items.length === 0) {
      return "[]";
    }
    return JSON.stringify(
      items
        .map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }))
        .sort((a, b) => a.productId.localeCompare(b.productId)),
    );
  }, []);

  useEffect(() => {
    if (isInitialLoadDone.current) {
      return;
    }
    if (loading) {
      return;
    }
    if (error || data?.myCart === null) {
      isInitialLoadDone.current = true;
    }
    if (data?.myCart) {
      const serverItemsSnapshot = generateSnapshot(data.myCart.items);
      const serverSavedSnapshot = generateSnapshot(
        data.myCart.savedForLaterItems,
      );
      lastSyncedSnapshot.current = `${serverItemsSnapshot}|${serverSavedSnapshot}`;

      setCart(data.myCart);
      setSaveForLaterCart({
        ...data.myCart,
        items: data.myCart.savedForLaterItems,
      });
      isInitialLoadDone.current = true;
    }
  }, [loading, error, data, setCart, setSaveForLaterCart, generateSnapshot]);

  const cartSnapshot = useMemo(
    () => generateSnapshot(cart?.items || []),
    [cart, generateSnapshot],
  );

  const savedSnapshot = useMemo(
    () => generateSnapshot(saveForLaterCart?.items || []),
    [saveForLaterCart, generateSnapshot],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (!isInitialLoadDone.current) {
      return;
    }

    const combined = `${cartSnapshot}|${savedSnapshot}`;
    if (combined === lastSyncedSnapshot.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await syncCart({
          variables: {
            items: JSON.parse(cartSnapshot),
            savedForLaterItems: JSON.parse(savedSnapshot),
          },
        });
        lastSyncedSnapshot.current = combined;
      } catch (error) {
        console.error("Cart sync failed:", error);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, cartSnapshot, savedSnapshot, syncCart]);

  return null;
}
