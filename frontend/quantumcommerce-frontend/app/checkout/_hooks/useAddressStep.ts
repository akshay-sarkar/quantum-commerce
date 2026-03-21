"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_MY_ADDRESSES, SAVE_ADDRESS_MUTATION, DELETE_ADDRESS_MUTATION } from "@/graphql/gql";
import { IAddress } from "@/models";
import { AddressForm, EMPTY_ADDRESS } from "../_types";
import { validateAddressForm } from "../_lib/addressValidation";

export interface AddressStepState {
  savedAddresses: IAddress[];
  addressLoading: boolean;
  savingAddress: boolean;
  deletingAddress: boolean;
  addressForm: AddressForm;
  setAddressForm: React.Dispatch<React.SetStateAction<AddressForm>>;
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  addressError: string;
  confirmedAddress: IAddress | null;
  handleContinueAddress: (onSuccess: () => void) => Promise<void>;
  handleDeleteAddress: (id: string) => Promise<void>;
}

export function useAddressStep(): AddressStepState {
  const [addressForm, setAddressForm] = useState<AddressForm>(EMPTY_ADDRESS);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [addressError, setAddressError] = useState("");
  const [confirmedAddress, setConfirmedAddress] = useState<IAddress | null>(null);

  const { data: addressData, loading: addressLoading, refetch: refetchAddresses } = useQuery<{ myAddresses: IAddress[] }>(
    GET_MY_ADDRESSES,
    { fetchPolicy: "network-only" },
  );

  const [saveAddress, { loading: savingAddress }] = useMutation<{ saveAddress: IAddress }>(SAVE_ADDRESS_MUTATION);
  const [deleteAddress, { loading: deletingAddress }] = useMutation<{ deleteAddress: boolean }>(DELETE_ADDRESS_MUTATION);

  const savedAddresses: IAddress[] = addressData?.myAddresses ?? [];

  useEffect(() => {
    if (!addressData) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedId(savedAddresses.length > 0 ? savedAddresses[0].id : "new");
  }, [addressData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContinueAddress = async (onSuccess: () => void) => {
    setAddressError("");

    if (selectedId !== "new") {
      const picked = savedAddresses.find((a) => a.id === selectedId) ?? null;
      setConfirmedAddress(picked);
      onSuccess();
      return;
    }

    const error = validateAddressForm(addressForm);
    if (error) {
      setAddressError(error);
      return;
    }

    const { street, city, state, zip, country } = addressForm;
    try {
      const { data } = await saveAddress({
        variables: { input: { street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), country: country.trim() } },
      });
      const newAddr = data!.saveAddress;
      await refetchAddresses();
      setConfirmedAddress(newAddr);
      setSelectedId(newAddr.id);
      setAddressForm(EMPTY_ADDRESS);
      onSuccess();
    } catch (err: unknown) {
      setAddressError(err instanceof Error ? err.message : "Failed to save address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress({ variables: { id } });
      await refetchAddresses();
      if (selectedId === id) {
        const remaining = savedAddresses.filter((a) => a.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : "new");
      }
    } catch {
      // silently ignore — list will not update if delete fails
    }
  };

  return {
    savedAddresses,
    addressLoading,
    savingAddress,
    deletingAddress,
    addressForm,
    setAddressForm,
    selectedId,
    setSelectedId,
    addressError,
    confirmedAddress,
    handleContinueAddress,
    handleDeleteAddress,
  };
}
