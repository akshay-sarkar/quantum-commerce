"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

interface OrderConfirmedProps {
  finalTotal: number;
  onContinueShopping: () => void;
}

export function OrderConfirmed({ finalTotal, onContinueShopping }: OrderConfirmedProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-qc-bg flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-qc-surface rounded-xl shadow-sm p-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="font-display text-3xl text-qc-text mb-2">Order Placed!</h1>
          <p className="text-qc-muted mb-6">
            Thank you for your purchase. Your order is being processed.
          </p>
          <p className="font-semibold text-qc-text mb-8">
            Total charged: ${finalTotal.toFixed(2)}
          </p>
          <button
            onClick={onContinueShopping}
            className="w-full py-3 rounded bg-qc-accent text-qc-accent-on font-semibold hover:bg-qc-accent-hover transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
