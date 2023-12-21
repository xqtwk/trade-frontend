import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthenticationService} from "../../../../../services/auth/authentication.service";
import {FormsModule} from "@angular/forms";
import {MfaToggleRequest} from "../../../../../models/auth/mfa-toggle-request";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-toggle-mfa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toggle-mfa.component.html',
  styleUrl: './toggle-mfa.component.css'
})
export class ToggleMfaComponent implements OnInit{
  mfaEnabled?: boolean; // Determine the current MFA status based on the user's data
  otpCode: string = '';
  qrCodeImageUri: string | null = null;
  message: string = '';
  secret: string = '';
  constructor(private authService: AuthenticationService, private router: Router, private dialogRef: MatDialogRef<ToggleMfaComponent>) {}

  ngOnInit(): void {
    this.authService.getMfaSetup().subscribe({
      next: (response) => {
        this.qrCodeImageUri = response.qrCodeImageUri;
        this.mfaEnabled = !this.qrCodeImageUri;
        this.secret = response.newSecret;
      },
      error: (error) => {
        this.message = 'Error fetching MFA setup information.';
        console.error('MFA Setup Error:', error);
      }
    });
  }

  toggleMfa(): void {
    const request: MfaToggleRequest = {
      enableMfa: !this.mfaEnabled,
      otpCode: this.otpCode,
      secret: this.secret
    };

    this.authService.toggleMfa(request).subscribe({
      next: (response) => {
        this.mfaEnabled = !this.mfaEnabled;
        this.qrCodeImageUri = null;
        this.message = this.mfaEnabled ? 'MFA has been enabled.' : 'MFA has been disabled.';
        setTimeout(() => {
          this.dialogRef.close();
          this.router.navigate(['profile/settings']);
        }, 3000) ;
      },
      error: (error) => {
        this.message = `Error toggling MFA: ${error.message}`;
        console.error('MFA Toggle Error:', error);
      }
    });
  }
}
