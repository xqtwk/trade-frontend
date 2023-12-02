import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from "../../services/user/user.service";
import {ChangePasswordRequest} from "../../models/change-password-request";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profileSettings.component.html',
  styleUrl: './profileSettings.component.css'
})
export class ProfileSettingsComponent {
  changePasswordRequest: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  };
  constructor(private userService: UserService, public dialogRef: MatDialogRef<ProfileSettingsComponent>) {}

  changePassword() {
    this.userService.changePassword(this.changePasswordRequest).subscribe({
      next: () => {
        this.dialogRef.close();
      },
      error: (error) => {
        return "error";
      }
    });
  }
}
