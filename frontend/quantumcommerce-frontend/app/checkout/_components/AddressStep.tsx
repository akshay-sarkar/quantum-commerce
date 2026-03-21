"use client";

import regions from "@/data/regions.json";
import { AddressForm, EMPTY_ADDRESS } from "../_types";
import { IAddress } from "@/models";
import { AddressField, SelectField } from "./FormFields";

interface AddressStepProps {
  savedAddresses: IAddress[];
  addressLoading: boolean;
  savingAddress: boolean;
  deletingAddress: boolean;
  addressForm: AddressForm;
  setAddressForm: React.Dispatch<React.SetStateAction<AddressForm>>;
  selectedId: string;
  setSelectedId: React.Dispatch<React.SetStateAction<string>>;
  addressError: string;
  onContinue: () => void;
  onDeleteAddress: (id: string) => Promise<void>;
}

export function AddressStep({
  savedAddresses,
  addressLoading,
  savingAddress,
  deletingAddress,
  addressForm,
  setAddressForm,
  selectedId,
  setSelectedId,
  addressError,
  onContinue,
  onDeleteAddress,
}: AddressStepProps) {
  if (addressLoading) {
    return <p className="text-qc-muted text-sm">Loading addresses…</p>;
  }

  return (
    <div className="space-y-3">
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
            onChange={() => setSelectedId(addr.id)}
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
              onDeleteAddress(addr.id);
            }}
            disabled={deletingAddress}
            className="text-xs text-qc-muted hover:text-red-500 transition-colors shrink-0 mt-0.5"
            aria-label="Remove address"
          >
            Remove
          </button>
        </label>
      ))}

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
          }}
          className="mt-0.5 accent-[var(--qc-accent)] shrink-0"
        />
        <span className="text-sm font-medium text-qc-text">+ Add a new address</span>
      </label>

      {selectedId === "new" && (
        <div className="space-y-3 pt-1 pl-1">
          <AddressField
            label="Street"
            value={addressForm.street}
            onChange={(v) => setAddressForm((f) => ({ ...f, street: v }))}
            placeholder="123 Main St"
          />
          <div className="grid grid-cols-2 gap-3">
            <AddressField
              label="City"
              value={addressForm.city}
              onChange={(v) => setAddressForm((f) => ({ ...f, city: v }))}
              placeholder="New York"
            />
            <SelectField
              label="State / Province"
              value={addressForm.state}
              onChange={(v) => setAddressForm((f) => ({ ...f, state: v }))}
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
              label="ZIP / Postal Code"
              value={addressForm.zip}
              onChange={(v) => {
                let filtered = v;
                if (addressForm.country === "US") {
                  filtered = v.replace(/\D/g, "").slice(0, 5);
                } else if (addressForm.country === "CA") {
                  filtered = v.replace(/[^A-Za-z0-9 ]/g, "").slice(0, 7);
                }
                setAddressForm((f) => ({ ...f, zip: filtered }));
              }}
              placeholder={
                addressForm.country === "US"
                  ? "10001"
                  : addressForm.country === "CA"
                    ? "M5V 3A8"
                    : "ZIP / Postal Code"
              }
            />
            <SelectField
              label="Country"
              value={addressForm.country}
              onChange={(v) =>
                setAddressForm((f) => ({ ...f, country: v, state: "", zip: "" }))
              }
              options={regions.countries.map((c) => ({ value: c.code, label: c.name }))}
              placeholder="Select country"
            />
          </div>
        </div>
      )}

      {addressError && <p className="text-red-500 text-sm">{addressError}</p>}

      <button
        onClick={onContinue}
        disabled={savingAddress}
        className="w-full py-2.5 rounded bg-qc-accent text-qc-accent-on font-semibold hover:bg-qc-accent-hover transition-colors disabled:opacity-50"
      >
        {savingAddress ? "Saving…" : "Continue to Payment"}
      </button>
    </div>
  );
}
