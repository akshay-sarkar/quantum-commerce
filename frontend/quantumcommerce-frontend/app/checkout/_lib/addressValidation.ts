import { AddressForm } from "../_types";

/** Returns an error string, or null if the form is valid. */
export function validateAddressForm(form: AddressForm): string | null {
  const { street, city, state, zip, country } = form;
  if (!street.trim() || !city.trim() || !state.trim() || !zip.trim() || !country.trim()) {
    return "All address fields are required.";
  }
  if (country === "US" && !/^\d{5}$/.test(zip.trim())) {
    return "US ZIP code must be exactly 5 digits.";
  }
  if (country === "CA" && !/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(zip.trim())) {
    return "Canadian postal code must be in the format A1A 1A1.";
  }
  return null;
}
