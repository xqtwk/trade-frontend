import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DepositRequest} from "../../models/payments/deposit-request";
import {Observable} from "rxjs";
import {DepositResponse} from "../../models/payments/deposit-response";
import {environment} from "../../../environments/environment";

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
}
