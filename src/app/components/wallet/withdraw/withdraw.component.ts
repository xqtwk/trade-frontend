import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import { NgxPlaidLinkModule } from "ngx-plaid-link";
@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogActions, MatDialogContent, ReactiveFormsModule,
    NgxPlaidLinkModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent {

}
