import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "../models/registration-request";
import {AuthenticationRequest} from "../models/authentication-request";
import {AuthenticationResponse} from "../models/authentication-response";
import {VerificationRequest} from "../models/verification-request";
import {BehaviorSubject, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:8080/auth';
  private isAuthenticated = new BehaviorSubject<boolean>(this.checkToken());


  constructor(private http: HttpClient) {
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(
    registerRequest: RegisterRequest
  ) {
    return this.http.post<AuthenticationResponse>
    (`${this.baseUrl}/register`, registerRequest);
  }

  login(authRequest: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest).pipe(
      tap(response => {
        if (response && response.accessToken) {
          localStorage.setItem('token', response.accessToken);
          this.isAuthenticated.next(true);
        }
      })
    );
  }

  verifyCode(verificationRequest: VerificationRequest) {
    return this.http.post<AuthenticationResponse>
    (`${this.baseUrl}/verify`, verificationRequest);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  get isAuthenticatedObservable(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }
  get isAuthenticatedValue(): boolean {
    return this.isAuthenticated.value;
  }
}
