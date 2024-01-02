export interface Transaction{
  id: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}
export enum TransactionType {
  PAYMENT = "PAYMENT",
  PAYOUT = "PAYOUT"
}
export enum TransactionStatus {
  PENDING= "PENDING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED"
}
