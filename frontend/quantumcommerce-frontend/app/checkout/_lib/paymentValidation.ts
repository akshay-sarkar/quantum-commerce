import { PaymentForm } from "../_types";

/** Returns an error string, or null if the form is valid. */
export function validatePaymentForm(form: PaymentForm): string | null {
  const { nameOnCard, cardNumber, expiry } = form;
  const rawCard = cardNumber.replace(/\s/g, "");
  if (!nameOnCard.trim()) {
    return "Name on card is required.";
  }
  if (rawCard.length !== 16) {
    return "Card number must be 16 digits.";
  }
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return "Expiry must be MM/YY.";
  }
  const [mm, yy] = expiry.split("/").map(Number);
  if (mm < 1 || mm > 12) {
    return "Expiry month must be between 01 and 12.";
  }
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
    return "Card has expired.";
  }
  return null;
}
