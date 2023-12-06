import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from "../../../services/user/user.service";
import {ChangePasswordRequest} from "../../../models/change-password-request";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ChangePasswordComponent} from "./changepassword/changepassword.component";
import {ToggleMfaComponent} from "./mfa/toggle-mfa/toggle-mfa.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profileSettings.component.html',
  styleUrl: './profileSettings.component.css'
})
export class ProfileSettingsComponent implements OnInit{
  mfaEnabled?: boolean;
  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
      this.userService.getPrivateUserData().subscribe(
        (userData) => {
          this.mfaEnabled = userData.mfaEnabled;
        },
        (error) => {

        }
      );

  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '500px',
      // ... additional configuration if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // ... handle actions after the dialog is closed
    });
  }
  openMfaToggleDialog() {
    const dialogRef = this.dialog.open(ToggleMfaComponent, {
      width: '500px',
      // ... additional configuration if needed
    });
    dialogRef.afterClosed().subscribe(result => {
      // ... handle actions after the dialog is closed
    });
  }
}
