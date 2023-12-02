import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../services/user/user.service";
import {ChangePasswordRequest} from "../../../../models/change-password-request";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogActions, FormsModule, MatDialogClose, MatButtonModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangePasswordComponent {
  changePasswordRequest: ChangePasswordRequest = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  };
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>
  ) {}

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
