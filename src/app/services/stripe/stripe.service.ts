import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {publishableKey} from "../../../assets/publishableKey";
import {WithdrawRequest} from "../../models/withdraw-request";
import {DepositRequest} from "../../models/deposit-request";
import {StripeCustomAccountCreateRequest} from "../../models/stripe-custom-account-create-request";

@Injectable({
    providedIn: 'root'
})
export class StripeService {
    private baseUrl = 'https://localhost:8080/pay';
    private publishableKey = publishableKey.publishableKey;

    constructor(private http: HttpClient) {
    }

    getPublishableKey() {
        return this.publishableKey;
    }



  createCustomAccount(customAccountRequest: StripeCustomAccountCreateRequest): Observable<StripeCustomAccountCreateRequest> {
    return this.http.post<StripeCustomAccountCreateRequest>(`${this.baseUrl}/create-account`, customAccountRequest);
  }

    topUpBalance(amount: number, userId: string, tokenId: string) {
        const paymentRequest: DepositRequest = {
            amount: amount,
            username: userId,// change pls
            country: tokenId// change pls
        };

        return this.http.post(`${this.baseUrl}/top-up`, paymentRequest, {responseType: 'text'}) as Observable<string>;


    }

    transfer(amount: number, connectedAccountId: string, userId: string, tokenId: string): Observable<string> {
        const transferRequest: WithdrawRequest = {
            amount,
            connectedAccountId,
            userId,
            tokenId
        };
        return this.http.post<string>(`${this.baseUrl}/transfer`, transferRequest, );
    }

    createCustomer(user: any): Observable<any> {
        //return this.http.post(`${this.baseUrl}/customer`, user);
        return this.http.post<any>(`${this.baseUrl}/customer`, user);
    }

    addPaymentMethod(customerId: string, paymentMethodId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/customer/${customerId}/payment-method`, {paymentMethodId}, { responseType: 'text' as 'json' });

    }
}
