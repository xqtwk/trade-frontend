import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import {DepositComponent} from "./deposit/deposit.component";
import {WithdrawComponent} from "./withdraw/withdraw.component";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent {
  constructor(private dialog: MatDialog) {}

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
