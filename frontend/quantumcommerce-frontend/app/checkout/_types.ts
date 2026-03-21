export interface AddressForm {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentForm {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
}

export const EMPTY_ADDRESS: AddressForm = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

export const EMPTY_PAYMENT: PaymentForm = {
  nameOnCard: "",
  cardNumber: "",
  expiry: "",
};
