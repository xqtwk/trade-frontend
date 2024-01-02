import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DepositRequest} from "../../models/payments/deposit-request";
import {Observable} from "rxjs";
import {DepositResponse} from "../../models/payments/deposit-response";
import {environment} from "../../../environments/environment";
import {WithdrawRequest} from "../../models/payments/withdraw-request";
import {SepaPayoutRequest} from "../../models/payments/sepa-payout-request";

@Injectable({
  providedIn: 'root'
})
export class RapydService {
  private baseUrl = environment.apiUrl + 'pay';


  constructor(private http: HttpClient) {
  }

  createCheckout(depositRequest: DepositRequest): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${this.baseUrl}/deposit`, depositRequest);
  }

  createCardPayout(payoutRequest: WithdrawRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/withdraw`, payoutRequest);
  }

  createEuSepaBankPayout(payoutRequest: SepaPayoutRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/payout/sepa`, payoutRequest);
  }
}
