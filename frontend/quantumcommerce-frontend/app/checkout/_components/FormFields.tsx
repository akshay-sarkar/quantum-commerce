"use client";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  maxLength?: number;
}

export function AddressField({ label, value, onChange, placeholder }: Omit<FieldProps, "maxLength">) {
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

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}

export function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
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

export function PaymentField({ label, value, onChange, placeholder, maxLength }: FieldProps) {
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
