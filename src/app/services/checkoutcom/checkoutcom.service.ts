import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CheckoutcomService {
  private baseUrl = 'https://localhost:8080/payapi';
  constructor(private http: HttpClient) { }

  /*sendPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, paymentData);
  }*/
  sendPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, paymentData);
  }
}
