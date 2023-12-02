import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {publishableKey} from "../../../assets/publishableKey";

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'https://localhost:8080/pay';
  private publishableKey = publishableKey.publishableKey;
  constructor(private http: HttpClient) { }

  getPublishableKey() {
    return this.publishableKey;
  }
  topUpBalance(amount: number, userId: string, tokenId: string) {
    const paymentRequest = {
      amount: amount,
      userId: userId,
      tokenId: tokenId
    };
    return this.http.post(`${this.baseUrl}/top-up`, paymentRequest, { responseType: 'text' }) as Observable<string>;


  }

  payout(amount: number, userId: string) {
    return this.http.post(`${this.baseUrl}/payout`, { amount, userId });
  }
}
