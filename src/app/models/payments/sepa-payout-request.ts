export interface SepaPayoutRequest {
  senderCurrency: string; // "EUR"
  senderCountry: string;
  senderEntityType: string; // "company"
  beneficiaryCountry: string;
  payoutCurrency: string; // "EUR"
  beneficiaryEntityType: string; // "individual"
  beneficiaryFirstName: string;
  beneficiaryLastName: string;
  beneficiaryIban: string;
  senderCompanyName: string;
  amount: number;
  description: string;
  statementDescriptor: string;
}
