import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LinkTokenResponse} from "../../models/link-token-response";
import {Observable} from "rxjs";
import {UsernameRequest} from "../../models/username-request";
import {ExchangePublicTokenRequest} from "../../models/exchange-public-token-request";
import {ExchangePublicTokenResponse} from "../../models/exchange-public-token-response";
import {CreateBankAccountTokenRequest} from "../../models/create-bank-account-token-request";

@Injectable({
  providedIn: 'root'
})
export class PlaidService {
  private baseUrl = 'https://localhost:8080/plaid';
  constructor(private http: HttpClient) {}

  createLinkToken(usernameRequest: UsernameRequest): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/create_link_token`, usernameRequest, {
      responseType: 'text' as 'json'
    });
  }
  createStripeBankAccountToken(createAccountBankTokenRequest: CreateBankAccountTokenRequest): Observable<CreateBankAccountTokenRequest> {
    return this.http.post<CreateBankAccountTokenRequest>(`${this.baseUrl}/create-bank-account-token`, createAccountBankTokenRequest);
  }

  exchangePublicToken(exchangePublicTokenRequest: ExchangePublicTokenRequest): Observable<ExchangePublicTokenResponse> {
    return this.http.post<ExchangePublicTokenResponse>(`${this.baseUrl}/exchange_public_token`, exchangePublicTokenRequest);
  }


}
