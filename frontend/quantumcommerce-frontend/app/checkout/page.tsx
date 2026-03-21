"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import useCartStore from "@/stores/cartStore";
import { useAddressStep } from "./_hooks/useAddressStep";
import { usePaymentStep } from "./_hooks/usePaymentStep";
import { AccordionStep } from "./_components/AccordionStep";
import { AddressStep } from "./_components/AddressStep";
import { PaymentStep } from "./_components/PaymentStep";
import { OrderConfirmed } from "./_components/OrderConfirmed";

type Step = "address" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart.items ?? []);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const [activeStep, setActiveStep] = useState<Step>("address");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);

  const addressStep = useAddressStep();
  const paymentStep = usePaymentStep();

  if (orderPlaced) {
    return (
      <OrderConfirmed
        finalTotal={finalTotal}
        onContinueShopping={() => router.push("/products")}
      />
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-qc-bg px-6 py-12 transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
          <h1
            className="font-display text-qc-text tracking-[-0.02em] mb-8"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}
          >
            Checkout
          </h1>

          <div className="bg-qc-surface rounded-xl border border-qc-border p-4 mb-6 flex justify-between items-center">
            <span className="text-qc-muted text-sm">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-qc-text">Total: ${total.toFixed(2)}</span>
          </div>

          <AccordionStep
            number={1}
            title="Shipping Address"
            open={activeStep === "address"}
            completed={activeStep === "payment"}
            onEdit={() => setActiveStep("address")}
            summary={
              addressStep.confirmedAddress
                ? `${addressStep.confirmedAddress.street}, ${addressStep.confirmedAddress.city}, ${addressStep.confirmedAddress.state} ${addressStep.confirmedAddress.zip}, ${addressStep.confirmedAddress.country}`
                : undefined
            }
          >
            <AddressStep
              {...addressStep}
              onContinue={() => addressStep.handleContinueAddress(() => setActiveStep("payment"))}
              onDeleteAddress={addressStep.handleDeleteAddress}
            />
          </AccordionStep>

          <AccordionStep
            number={2}
            title="Payment Details"
            open={activeStep === "payment"}
            completed={false}
          >
            <PaymentStep
              {...paymentStep}
              total={total}
              onPlaceOrder={() =>
                paymentStep.handlePlaceOrder(total, (snapshotTotal) => {
                  setFinalTotal(snapshotTotal);
                  clearCart();
                  setOrderPlaced(true);
                })
              }
              onDeletePayment={paymentStep.handleDeletePayment}
            />
          </AccordionStep>
        </div>
      </div>
    </ProtectedRoute>
  );
}
