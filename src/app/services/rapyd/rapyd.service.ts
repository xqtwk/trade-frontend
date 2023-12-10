import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DepositRequest} from "../../models/deposit-request";
import {Observable} from "rxjs";
import {DepositResponse} from "../../models/deposit-response";

@Injectable({
  providedIn: 'root'
})
export class RapydService {
  private baseUrl = 'https://localhost:8080/pay';


  constructor(private http: HttpClient) {
  }

  createCheckout(depositRequest: DepositRequest): Observable<DepositResponse> {
    return this.http.post<DepositResponse>(`${this.baseUrl}/deposit`, depositRequest);
  }
}
