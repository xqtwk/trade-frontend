import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RegisterRequest} from "../models/registration-request";
import {AuthenticationRequest} from "../models/authentication-request";
import {AuthenticationResponse} from "../models/authentication-response";
import {VerificationRequest} from "../models/verification-request";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = 'http://localhost:8080/auth'

  constructor(private http: HttpClient) { }
    register(
        registerRequest: RegisterRequest
    ) {
        return this.http.post<AuthenticationResponse>
        (`${this.baseUrl}/register`, registerRequest);
    }

    login(
        authRequest: AuthenticationRequest
    ) {
        return this.http.post<AuthenticationResponse>
        (`${this.baseUrl}/authenticate`, authRequest);
    }

    verifyCode(verificationRequest: VerificationRequest) {
        return this.http.post<AuthenticationResponse>
        (`${this.baseUrl}/verify`, verificationRequest);
    }

}
