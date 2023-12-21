import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {RegisterRequest} from "../../../models/auth/registration-request";
import {AuthenticationResponse} from "../../../models/auth/authentication-response";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../../services/auth/authentication.service";
import {VerificationRequest} from "../../../models/auth/verification-request";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';
  otpCode = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  registerUser() {
    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        if (response.accessToken && !response.mfaEnabled) {
          localStorage.setItem('token', response.accessToken);
          // Notify the application that the user is authenticated
          this.authService.setAuthenticated(true);
          this.router.navigate(['']); // Navigate to home page or dashboard
        } else if (response.mfaEnabled) {
          this.authResponse = response;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  verifyTfa() {
    this.message = '';
    const verifyRequest: VerificationRequest = {
      username: this.registerRequest.username,
      code: this.otpCode
    };
    this.authService.verifyCode(verifyRequest)
      .subscribe({
        next: (response) => {
          this.message = 'Account created successfully\nYou will be redirected to the Welcome page in 3 seconds';
          setTimeout(() => {
            localStorage.setItem('token', response.accessToken as string);
            this.router.navigate(['']);
          }, 3000);
        }
      });
  }
}
