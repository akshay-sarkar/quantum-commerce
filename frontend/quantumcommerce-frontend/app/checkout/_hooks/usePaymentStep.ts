"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_MY_PAYMENTS, SAVE_PAYMENT_MUTATION, DELETE_PAYMENT_MUTATION } from "@/graphql/gql";
import { IPayment } from "@/models";
import { PaymentForm, EMPTY_PAYMENT } from "../_types";
import { validatePaymentForm } from "../_lib/paymentValidation";

export interface PaymentStepState {
  savedPayments: IPayment[];
  paymentLoading: boolean;
  savingPayment: boolean;
  deletingPayment: boolean;
  paymentForm: PaymentForm;
  setPaymentForm: React.Dispatch<React.SetStateAction<PaymentForm>>;
  selectedPaymentId: string;
  setSelectedPaymentId: React.Dispatch<React.SetStateAction<string>>;
  paymentError: string;
  transactionCvv: string;
  setTransactionCvv: React.Dispatch<React.SetStateAction<string>>;
  handleDeletePayment: (id: string) => Promise<void>;
  handlePlaceOrder: (total: number, onSuccess: (total: number) => void) => Promise<void>;
}

export function usePaymentStep(): PaymentStepState {
  const [paymentForm, setPaymentForm] = useState<PaymentForm>(EMPTY_PAYMENT);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("new");
  const [paymentError, setPaymentError] = useState("");
  const [transactionCvv, setTransactionCvv] = useState("");

  const { data: paymentData, loading: paymentLoading, refetch: refetchPayments } = useQuery<{ myPayments: IPayment[] }>(
    GET_MY_PAYMENTS,
    { fetchPolicy: "network-only" },
  );

  const [savePayment, { loading: savingPayment }] = useMutation<{ savePayment: IPayment }>(SAVE_PAYMENT_MUTATION);
  const [deletePayment, { loading: deletingPayment }] = useMutation<{ deletePayment: boolean }>(DELETE_PAYMENT_MUTATION);

  const savedPayments: IPayment[] = paymentData?.myPayments ?? [];

  useEffect(() => {
    if (!paymentData) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedPaymentId(savedPayments.length > 0 ? savedPayments[0].id : "new");
  }, [paymentData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeletePayment = async (id: string) => {
    try {
      await deletePayment({ variables: { id } });
      await refetchPayments();
      if (selectedPaymentId === id) {
        const remaining = savedPayments.filter((p) => p.id !== id);
        setSelectedPaymentId(remaining.length > 0 ? remaining[0].id : "new");
      }
    } catch {
      // silently ignore — list will not update if delete fails
    }
  };

  const handlePlaceOrder = async (total: number, onSuccess: (total: number) => void) => {
    setPaymentError("");

    if (!/^\d{3}$/.test(transactionCvv)) {
      setPaymentError("CVV must be 3 digits.");
      return;
    }

    if (selectedPaymentId === "new") {
      const error = validatePaymentForm(paymentForm);
      if (error) {
        setPaymentError(error);
        return;
      }
      const { nameOnCard, cardNumber, expiry } = paymentForm;
      const rawCard = cardNumber.replace(/\s/g, "");
      try {
        await savePayment({
          variables: { input: { nameOnCard: nameOnCard.trim(), cardNumber: rawCard, expiry } },
        });
        await refetchPayments();
      } catch (err: unknown) {
        setPaymentError(err instanceof Error ? err.message : "Failed to save payment.");
        return;
      }
    }

    onSuccess(total);
  };

  return {
    savedPayments,
    paymentLoading,
    savingPayment,
    deletingPayment,
    paymentForm,
    setPaymentForm,
    selectedPaymentId,
    setSelectedPaymentId,
    paymentError,
    transactionCvv,
    setTransactionCvv,
    handleDeletePayment,
    handlePlaceOrder,
  };
}
