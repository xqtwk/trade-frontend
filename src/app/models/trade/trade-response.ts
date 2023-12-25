export interface TradeResponse {
  id: number;
  senderUsername: string;
  receiverUsername: string;
  amount: number;
  senderConfirmed: boolean;
  receiverConfirmed: boolean;
  status: TradeStatus;
  assetId: number;
}

export enum TradeStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ISSUE = "ISSUE"
}
