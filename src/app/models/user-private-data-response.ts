import {Transaction} from "./transaction";

export interface UserPrivateDataResponse {
  id: number;
  username: string;
  email: string;
  balance: number;
  role: 'USER' | 'ADMIN';
  mfaEnabled: boolean;
  transactions: Transaction[];
}
