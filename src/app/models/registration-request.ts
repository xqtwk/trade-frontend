export interface RegisterRequest {
  username?: string;
  password?: string;
  email?: string;
  //role: string;
  mfaEnabled?: boolean;
}
