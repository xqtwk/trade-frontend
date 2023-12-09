export interface StripeCustomAccountCreateRequest {
  country: string;
  email: string;
  url: string;
  tosIp: string;
  firstName: string;
  lastName: string;
  dobDay: number;
  dobMonth: number;
  dobYear: number;
  line1: string;
  postalCode: string;
  city: string;
  iban: string;
  amount: number; // or string, depending on how you handle this field
}
