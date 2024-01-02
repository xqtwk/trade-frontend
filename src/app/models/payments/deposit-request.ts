export interface DepositRequest {
    username: string;
    country: string;
    amount: number;
    merchantReferenceId: string;
    description: string;
}
