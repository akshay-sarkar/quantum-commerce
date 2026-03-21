"use client";

import { IPayment } from "@/models";
import { PaymentForm, EMPTY_PAYMENT } from "../_types";
import { PaymentField } from "./FormFields";
import { formatCardNumber, formatExpiry } from "../_lib/paymentFormatters";

interface PaymentStepProps {
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
  total: number;
  onPlaceOrder: () => void;
  onDeletePayment: (id: string) => Promise<void>;
}

export function PaymentStep({
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
  total,
  onPlaceOrder,
  onDeletePayment,
}: PaymentStepProps) {
  if (paymentLoading) {
    return <p className="text-qc-muted text-sm">Loading payment methods…</p>;
  }

  return (
    <div className="space-y-3">
      {savedPayments.map((pmt) => (
        <label
          key={pmt.id}
          className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
            selectedPaymentId === pmt.id
              ? "border-qc-accent bg-qc-accent/5"
              : "border-qc-border bg-qc-bg hover:border-qc-accent/50"
          }`}
        >
          <input
            type="radio"
            name="paymentChoice"
            value={pmt.id}
            checked={selectedPaymentId === pmt.id}
            onChange={() => {
              setSelectedPaymentId(pmt.id);
              setTransactionCvv("");
            }}
            className="mt-0.5 accent-[var(--qc-accent)] shrink-0"
          />
          <div className="flex-1 text-sm text-qc-text">
            <p className="font-medium">{pmt.nameOnCard}</p>
            <p className="text-qc-muted">
              •••• •••• •••• {pmt.last4} · Expires {pmt.expiry}
            </p>
            {selectedPaymentId === pmt.id && (
              <div className="mt-3">
                <PaymentField
                  label="CVV"
                  value={transactionCvv}
                  onChange={(v) => setTransactionCvv(v.replace(/\D/g, "").slice(0, 3))}
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onDeletePayment(pmt.id);
            }}
            disabled={deletingPayment}
            className="text-xs text-qc-muted hover:text-red-500 transition-colors shrink-0 mt-0.5"
            aria-label="Remove payment method"
          >
            Remove
          </button>
        </label>
      ))}

      <label
        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
          selectedPaymentId === "new"
            ? "border-qc-accent bg-qc-accent/5"
            : "border-qc-border bg-qc-bg hover:border-qc-accent/50"
        }`}
      >
        <input
          type="radio"
          name="paymentChoice"
          value="new"
          checked={selectedPaymentId === "new"}
          onChange={() => {
            setSelectedPaymentId("new");
            setPaymentForm(EMPTY_PAYMENT);
            setTransactionCvv("");
          }}
          className="mt-0.5 accent-[var(--qc-accent)] shrink-0"
        />
        <span className="text-sm font-medium text-qc-text">+ Add a new payment method</span>
      </label>

      {selectedPaymentId === "new" && (
        <div className="space-y-3 pt-1 pl-1">
          <PaymentField
            label="Name on Card"
            value={paymentForm.nameOnCard}
            onChange={(v) => setPaymentForm((f) => ({ ...f, nameOnCard: v }))}
            placeholder="Jane Doe"
          />
          <PaymentField
            label="Card Number"
            value={paymentForm.cardNumber}
            onChange={(v) => setPaymentForm((f) => ({ ...f, cardNumber: formatCardNumber(v) }))}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
          <div className="grid grid-cols-2 gap-3">
            <PaymentField
              label="Expiry (MM/YY)"
              value={paymentForm.expiry}
              onChange={(v) => setPaymentForm((f) => ({ ...f, expiry: formatExpiry(v) }))}
              placeholder="08/27"
              maxLength={5}
            />
            <PaymentField
              label="CVV"
              value={transactionCvv}
              onChange={(v) => setTransactionCvv(v.replace(/\D/g, "").slice(0, 3))}
              placeholder="123"
              maxLength={3}
            />
          </div>
        </div>
      )}

      {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
      <p className="text-xs text-qc-muted">
        This is a demo — no real payment is processed.
      </p>
      <button
        onClick={onPlaceOrder}
        disabled={savingPayment}
        className="w-full py-3 rounded bg-qc-accent text-qc-accent-on font-semibold hover:bg-qc-accent-hover transition-colors disabled:opacity-50"
        data-testid="place-order-btn"
      >
        {savingPayment ? "Saving…" : `Place Order — $${total.toFixed(2)}`}
      </button>
    </div>
  );
}
