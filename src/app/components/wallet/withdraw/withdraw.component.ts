import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import {Observable} from "rxjs";
import {WithdrawRequest} from "../../../models/payments/withdraw-request";
import {RapydService} from "../../../services/rapyd/rapyd.service";
import {UserService} from "../../../services/user/user.service";
import {UserPrivateDataResponse} from "../../../models/user-private-data-response";
import {SepaPayoutRequest} from "../../../models/payments/sepa-payout-request";
@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogActions, MatDialogContent, ReactiveFormsModule,
    NgxPlaidLinkModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent implements OnInit{
  userData!: UserPrivateDataResponse;
  payoutForm: FormGroup;
  username: string | undefined | null;
  constructor(private fb: FormBuilder, private rapydService: RapydService, private userService: UserService) {
    this.payoutForm = this.fb.group({
      amount: ['', Validators.required],
      beneficiaryFirstName: ['', Validators.required],
      beneficiaryLastName: ['', Validators.required],
      iban: ['', Validators.required],
      description: ['']
    });
  }

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
    this.username = this.userService.getUserNicknameFromToken();
    this.payoutForm = this.fb.group({
      beneficiaryFirstName: ['', Validators.required],
      beneficiaryLastName: ['', Validators.required],
      beneficiaryIban: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      description: [''],
      statementDescriptor: ['']
    });

  }
  onSubmit(): void {
    if (this.payoutForm.valid && this.username) {

      const payoutRequest: SepaPayoutRequest = {
        senderCurrency: 'EUR',
        senderCountry: "LT",
        senderEntityType: 'company',
        beneficiaryCountry: '',
        payoutCurrency: 'EUR',
        beneficiaryEntityType: 'individual',
        beneficiaryFirstName: this.payoutForm.value.beneficiaryFirstName,
        beneficiaryLastName: this.payoutForm.value.beneficiaryLastName,
        beneficiaryIban: this.payoutForm.value.beneficiaryIban,
        senderCompanyName: "Pixelpact",
        amount: this.payoutForm.value.amount,
        description: this.username,
        statementDescriptor: this.username
      };

      this.rapydService.createEuSepaBankPayout(payoutRequest).subscribe(
        response => {
          console.log('Payout created:', response);
          window.location.href = "https://pixelpact.eu/wallet";
        },
        error => {
          console.error('Payout creation failed:', error);
          // Handle error response
        }
      );
    }
  }

}

