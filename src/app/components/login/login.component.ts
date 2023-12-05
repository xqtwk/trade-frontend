import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthenticationRequest} from "../../models/authentication-request";
import {AuthenticationResponse} from "../../models/authentication-response";
import {AuthenticationService} from "../../services/auth/authentication.service";
import {Router, RouterLink} from "@angular/router";
import {VerificationRequest} from "../../models/verification-request";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {};
  otpCode = '';
  authResponse: AuthenticationResponse = {};

  constructor(
      private authService: AuthenticationService,
      private router: Router
  ) {
  }

  authenticate() {
    this.authService.login(this.authRequest)
        .subscribe({
          next: (response) => {
            this.authResponse = response;
            if (!this.authResponse.mfaEnabled) {
              localStorage.setItem('token', response.accessToken as string);
              this.router.navigate(['']);
            }
          }
        });
  }

  verifyCode() {
    const verifyRequest: VerificationRequest = {
      username: this.authRequest.username,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest)
        .subscribe({
          next: (response) => {
            localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['']);
          }
        });
  }
}
