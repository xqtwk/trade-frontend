export interface TradeResponse {
  id: number;
  senderUsername: string;
  receiverUsername: string;
  amount: number;
  senderConfirmed: boolean;
  receiverConfirmed: boolean;
}
