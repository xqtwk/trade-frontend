import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "../../models/auth/registration-request";
import {AuthenticationRequest} from "../../models/auth/authentication-request";
import {AuthenticationResponse} from "../../models/auth/authentication-response";
import {VerificationRequest} from "../../models/auth/verification-request";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {MfaToggleRequest} from "../../models/auth/mfa-toggle-request";
import {MfaSetupResponse} from "../../models/auth/mfa-setup-response";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = environment.apiUrl + 'auth';

  private isAuthenticated = new BehaviorSubject<boolean>(this.checkToken());

  constructor(private http: HttpClient) {
  }
  setAuthenticated(authenticated: boolean): void {
    this.isAuthenticated.next(authenticated);
  }

  private checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  refreshToken() {
    return this.http.get(`${this.baseUrl}/refresh-token`)
  }

  getMfaSetup(): Observable<MfaSetupResponse> {
    return this.http.get<MfaSetupResponse>(`${this.baseUrl}/mfa-setup`);
  }

  toggleMfa(request: MfaToggleRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/toggle-mfa`, request);
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
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/verify`, verificationRequest)
      .pipe(
        tap(response => {
          if (response && response.accessToken) {
            localStorage.setItem('token', response.accessToken);
            this.isAuthenticated.next(true); // Update authentication state
          }
        })
      );
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
