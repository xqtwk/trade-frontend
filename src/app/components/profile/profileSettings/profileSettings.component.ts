import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from "../../../services/user/user.service";
import {ChangePasswordRequest} from "../../../models/change-password-request";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ChangePasswordComponent} from "./changepassword/changepassword.component";

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profileSettings.component.html',
  styleUrl: './profileSettings.component.css'
})
export class ProfileSettingsComponent {
  constructor(private dialog: MatDialog) {}

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '500px',
      // ... additional configuration if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // ... handle actions after the dialog is closed
    });
  }
}
