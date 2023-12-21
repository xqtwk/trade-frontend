export interface MfaToggleRequest {
  enableMfa: boolean;
  otpCode: string;
  secret: string;
}
