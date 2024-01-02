export interface WithdrawRequest {
  username: string;
  amount: number;
  beneficiary: {
    email: string;
    cardNumber: string;
    cardExpirationMonth: string;
    cardExpirationYear: string;
    cardCvv: string;
    firstName: string;
    lastName: string;
  };
  beneficiaryCountry: string;
  payoutCurrency: string;
  beneficiaryEntityType: string;
  description: string;
  statementDescriptor: string;
}
