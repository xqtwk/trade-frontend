import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {DepositComponent} from "./deposit/deposit.component";
import {WithdrawComponent} from "./withdraw/withdraw.component";
import {MatButtonModule} from "@angular/material/button";
import {UserService} from "../../services/user/user.service";
import {UserPrivateDataResponse} from "../../models/user-private-data-response";

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit{
  userData!: UserPrivateDataResponse;
  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.userService.getPrivateUserData().subscribe(
      (userData: UserPrivateDataResponse) => {
        userData.transactions = userData.transactions.reverse();
        this.userData = userData;
        console.log(userData.transactions);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openDepositDialog() {
    const dialogRef = this.dialog.open(DepositComponent, {
      width: '500px',
      // ... additional configuration if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // ... handle actions after the dialog is closed
    });
  }
  openWithdrawDialog() {
    const dialogRef = this.dialog.open(WithdrawComponent, {
      width: '500px',
      // ... additional configuration if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // ... handle actions after the dialog is closed
    });
  }
}
