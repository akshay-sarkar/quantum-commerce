"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@apollo/client/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import useCartStore from "@/stores/cartStore";
import { GET_MY_ADDRESSES, SAVE_ADDRESS_MUTATION, DELETE_ADDRESS_MUTATION } from "@/graphql/gql";
import { IAddress } from "@/models";
import regions from "@/data/regions.json";

type Step = "address" | "payment";

interface AddressForm {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PaymentForm {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const EMPTY_ADDRESS: AddressForm = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

const EMPTY_PAYMENT: PaymentForm = {
  nameOnCard: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart.items ?? []);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const [activeStep, setActiveStep] = useState<Step>("address");
  const [confirmedAddress, setConfirmedAddress] = useState<IAddress | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(EMPTY_ADDRESS);
  // selectedId = one of the saved address IDs, or "new" to fill in a new one
  const [selectedId, setSelectedId] = useState<string>("new");
  const [paymentForm, setPaymentForm] = useState<PaymentForm>(EMPTY_PAYMENT);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addressError, setAddressError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const { data: addressData, loading: addressLoading, refetch: refetchAddresses } = useQuery(
    GET_MY_ADDRESSES,
    { fetchPolicy: "network-only" },
  );

  const [saveAddress, { loading: savingAddress }] = useMutation(SAVE_ADDRESS_MUTATION);
  const [deleteAddress, { loading: deletingAddress }] = useMutation(DELETE_ADDRESS_MUTATION);

  const savedAddresses: IAddress[] = addressData?.myAddresses ?? [];

  // Default to the first saved address when data loads
  useEffect(() => {
    if (!addressData) return;
    if (savedAddresses.length > 0) {
      setSelectedId(savedAddresses[0].id);
    } else {
      setSelectedId("new");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressData]);

  // ── Address step ──────────────────────────────────────────────────────

  const handleContinueAddress = async () => {
    setAddressError("");

    if (selectedId !== "new") {
      const picked = savedAddresses.find((a) => a.id === selectedId) ?? null;
      setConfirmedAddress(picked);
      setActiveStep("payment");
      return;
    }

    // "new" — validate and save
    const { street, city, state, zip, country } = addressForm;
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim() || !country.trim()) {
      setAddressError("All address fields are required.");
      return;
    }
    if (country === "US" && !/^\d{5}$/.test(zip.trim())) {
      setAddressError("US ZIP code must be exactly 5 digits.");
      return;
    }
    if (country === "CA" && !/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(zip.trim())) {
      setAddressError("Canadian postal code must be in the format A1A 1A1.");
      return;
    }
    try {
      const { data } = await saveAddress({
        variables: { input: { street: street.trim(), city: city.trim(), state: state.trim(), zip: zip.trim(), country: country.trim() } },
      });
      const newAddr: IAddress = data.saveAddress;
      await refetchAddresses();
      setConfirmedAddress(newAddr);
      setSelectedId(newAddr.id);
      setAddressForm(EMPTY_ADDRESS);
      setActiveStep("payment");
    } catch (err: unknown) {
      setAddressError(err instanceof Error ? err.message : "Failed to save address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress({ variables: { id } });
      await refetchAddresses();
      // If the deleted address was selected, fall back to the first remaining or "new"
      if (selectedId === id) {
        const remaining = savedAddresses.filter((a) => a.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : "new");
      }
    } catch {
      // silently ignore — address list will not update if delete fails
    }
  };

  // ── Payment step ─────────────────────────────────────────────────────

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePlaceOrder = () => {
    setPaymentError("");
    const { nameOnCard, cardNumber, expiry, cvv } = paymentForm;
    const rawCard = cardNumber.replace(/\s/g, "");
    if (!nameOnCard.trim()) {
      setPaymentError("Name on card is required.");
      return;
    }
    if (rawCard.length !== 16) {
      setPaymentError("Card number must be 16 digits.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setPaymentError("Expiry must be MM/YY.");
      return;
    }
    const [mm, yy] = expiry.split("/").map(Number);
    if (mm < 1 || mm > 12) {
      setPaymentError("Expiry month must be between 01 and 12.");
      return;
    }
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      setPaymentError("Card has expired.");
      return;
    }
    if (!/^\d{3}$/.test(cvv)) {
      setPaymentError("CVV must be 3 digits.");
      return;
    }
    clearCart();
    setOrderPlaced(true);
  };

  // ── Order confirmed screen ────────────────────────────────────────────

  if (orderPlaced) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-qc-bg flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-qc-surface rounded-xl shadow-sm p-10 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="font-display text-3xl text-qc-text mb-2">
              Order Placed!
            </h1>
            <p className="text-qc-muted mb-6">
              Thank you for your purchase. Your order is being processed.
            </p>
            <p className="font-semibold text-qc-text mb-8">
              Total charged: ${total.toFixed(2)}
            </p>
            <button
              onClick={() => router.push("/products")}
              className="w-full py-3 rounded bg-qc-accent text-qc-accent-on font-semibold hover:bg-qc-accent-hover transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </ProtectedRoute>
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

          {/* Order summary */}
          <div className="bg-qc-surface rounded-xl border border-qc-border p-4 mb-6 flex justify-between items-center">
            <span className="text-qc-muted text-sm">
              {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-qc-text">
              Total: ${total.toFixed(2)}
            </span>
          </div>

          {/* ── Step 1: Address ─────────────────────────────────────── */}
          <AccordionStep
            number={1}
            title="Shipping Address"
            open={activeStep === "address"}
            completed={activeStep === "payment"}
            onEdit={() => setActiveStep("address")}
            summary={
              confirmedAddress
                ? `${confirmedAddress.street}, ${confirmedAddress.city}, ${confirmedAddress.state} ${confirmedAddress.zip}, ${confirmedAddress.country}`
                : undefined
            }
          >
            {addressLoading ? (
              <p className="text-qc-muted text-sm">Loading addresses…</p>
            ) : (
              <div className="space-y-3">
                {/* ── One radio per saved address ── */}
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedId === addr.id
                        ? "border-qc-accent bg-qc-accent/5"
                        : "border-qc-border bg-qc-bg hover:border-qc-accent/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressChoice"
                      value={addr.id}
                      checked={selectedId === addr.id}
                      onChange={() => {
                        setSelectedId(addr.id);
                        setAddressError("");
                      }}
                      className="mt-0.5 accent-[var(--qc-accent)] shrink-0"
                    />
                    <div className="flex-1 text-sm text-qc-text leading-relaxed">
                      <p>{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p>{addr.country}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAddress(addr.id);
                      }}
                      disabled={deletingAddress}
                      className="text-xs text-qc-muted hover:text-red-500 transition-colors shrink-0 mt-0.5"
                      aria-label="Remove address"
                    >
                      Remove
                    </button>
                  </label>
                ))}

                {/* ── Add new address option ── */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedId === "new"
                      ? "border-qc-accent bg-qc-accent/5"
                      : "border-qc-border bg-qc-bg hover:border-qc-accent/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="addressChoice"
                    value="new"
                    checked={selectedId === "new"}
                    onChange={() => {
                      setSelectedId("new");
                      setAddressForm(EMPTY_ADDRESS);
                      setAddressError("");
                    }}
                    className="mt-0.5 accent-[var(--qc-accent)] shrink-0"
                  />
                  <span className="text-sm font-medium text-qc-text">
                    + Add a new address
                  </span>
                </label>

                {/* ── New address form ── */}
                {selectedId === "new" && (
                  <div className="space-y-3 pt-1 pl-1">
                    <AddressField
                      label="Street"
                      value={addressForm.street}
                      onChange={(v) =>
                        setAddressForm((f) => ({ ...f, street: v }))
                      }
                      placeholder="123 Main St"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <AddressField
                        label="City"
                        value={addressForm.city}
                        onChange={(v) =>
                          setAddressForm((f) => ({ ...f, city: v }))
                        }
                        placeholder="New York"
                      />
                      <SelectField
                        label="State / Province"
                        value={addressForm.state}
                        onChange={(v) =>
                          setAddressForm((f) => ({ ...f, state: v }))
                        }
                        options={
                          addressForm.country
                            ? (regions.states[addressForm.country as keyof typeof regions.states] ?? []).map(
                                (s) => ({ value: s.code, label: s.name }),
                              )
                            : []
                        }
                        placeholder="Select state"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <AddressField
                        label="ZIP Code"
                        value={addressForm.zip}
                        onChange={(v) =>
                          setAddressForm((f) => ({ ...f, zip: v }))
                        }
                        placeholder="10001"
                      />
                      <SelectField
                        label="Country"
                        value={addressForm.country}
                        onChange={(v) =>
                          setAddressForm((f) => ({ ...f, country: v, state: "" }))
                        }
                        options={regions.countries.map((c) => ({
                          value: c.code,
                          label: c.name,
                        }))}
                        placeholder="Select country"
                      />
                    </div>
                  </div>
                )}

                {addressError && (
                  <p className="text-red-500 text-sm">{addressError}</p>
                )}

                <button
                  onClick={handleContinueAddress}
                  disabled={savingAddress}
                  className="w-full py-2.5 rounded bg-qc-accent text-qc-accent-on font-semibold hover:bg-qc-accent-hover transition-colors disabled:opacity-50"
                >
                  {savingAddress ? "Saving…" : "Continue to Payment"}
                </button>
              </div>
            )}
          </AccordionStep>

          {/* ── Step 2: Payment ─────────────────────────────────────── */}
          <AccordionStep
            number={2}
            title="Payment Details"
            open={activeStep === "payment"}
            completed={false}
          >
            <div className="space-y-3">
              <PaymentField
                label="Name on Card"
                value={paymentForm.nameOnCard}
                onChange={(v) =>
                  setPaymentForm((f) => ({ ...f, nameOnCard: v }))
                }
                placeholder="Jane Doe"
              />
              <PaymentField
                label="Card Number"
                value={paymentForm.cardNumber}
                onChange={(v) =>
                  setPaymentForm((f) => ({
                    ...f,
                    cardNumber: formatCardNumber(v),
                  }))
                }
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-3">
                <PaymentField
                  label="Expiry (MM/YY)"
                  value={paymentForm.expiry}
                  onChange={(v) =>
                    setPaymentForm((f) => ({
                      ...f,
                      expiry: formatExpiry(v),
                    }))
                  }
                  placeholder="08/27"
                  maxLength={5}
                />
                <PaymentField
                  label="CVV"
                  value={paymentForm.cvv}
                  onChange={(v) =>
                    setPaymentForm((f) => ({
                      ...f,
                      cvv: v.replace(/\D/g, "").slice(0, 3),
                    }))
                  }
                  placeholder="123"
                  maxLength={3}
                />
              </div>
              {paymentError && (
                <p className="text-red-500 text-sm">{paymentError}</p>
              )}
              <p className="text-xs text-qc-muted">
                🔒 This is a demo — no real payment is processed.
              </p>
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded bg-qc-accent text-qc-accent-on font-semibold hover:bg-qc-accent-hover transition-colors"
                data-testid="place-order-btn"
              >
                Place Order — ${total.toFixed(2)}
              </button>
            </div>
          </AccordionStep>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface AccordionStepProps {
  number: number;
  title: string;
  open: boolean;
  completed: boolean;
  summary?: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

function AccordionStep({
  number,
  title,
  open,
  completed,
  summary,
  onEdit,
  children,
}: AccordionStepProps) {
  return (
    <div className="bg-qc-surface border border-qc-border rounded-xl mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
              completed
                ? "bg-green-500 text-white"
                : open
                  ? "bg-qc-accent text-qc-accent-on"
                  : "bg-qc-border text-qc-muted"
            }`}
          >
            {completed ? "✓" : number}
          </span>
          <div>
            <h2 className="font-semibold text-qc-text">{title}</h2>
            {completed && summary && (
              <p className="text-xs text-qc-muted mt-0.5 truncate max-w-xs">
                {summary}
              </p>
            )}
          </div>
        </div>
        {completed && onEdit && (
          <button
            onClick={onEdit}
            className="text-xs text-qc-accent hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      {open && (
        <div className="px-5 pb-5 border-t border-qc-border">{children}</div>
      )}
    </div>
  );
}

function AddressField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs text-qc-muted mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-qc-bg border border-qc-border rounded-lg px-3 py-2 text-sm text-qc-text placeholder-qc-muted focus:outline-none focus:border-qc-accent"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <div>
      <label className="block text-xs text-qc-muted mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-qc-bg border border-qc-border rounded-lg px-3 py-2 text-sm text-qc-text focus:outline-none focus:border-qc-accent"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PaymentField({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-qc-muted mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-qc-bg border border-qc-border rounded-lg px-3 py-2 text-sm text-qc-text placeholder-qc-muted focus:outline-none focus:border-qc-accent"
      />
    </div>
  );
}
