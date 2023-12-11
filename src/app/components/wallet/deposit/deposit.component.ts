import {AfterViewInit, Component, Directive, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {UserService} from "../../../services/user/user.service";
import {RapydService} from "../../../services/rapyd/rapyd.service";
import {DepositRequest} from "../../../models/deposit-request";
declare let Frames: any;

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent implements OnInit {
  userId: string = '';

  paymentForm = new FormGroup({
    country: new FormControl('LT', [Validators.required]),
    amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])
  });

  ngOnInit() {
    this.el.nativeElement.setAttribute('tabindex', '-1');
    console.log("beforemethod")
  }

  constructor(private rapydService: RapydService,
              private userService: UserService,
              private el: ElementRef) {

  }

  ngAfterViewInit(): void {

  }

  pay(): void {
    if (this.paymentForm.valid) {
      const amount = this.paymentForm.get('amount')?.value;
      const username = this.userService.getUserNicknameFromToken() as string;
      const country = this.paymentForm.get('country')?.value ?? '';

      if (amount != null && !isNaN(amount)) {
        const depositRequest: DepositRequest = {
          username: username,
          country: country,
          amount: parseFloat(amount)
        };

        this.rapydService.createCheckout(depositRequest).subscribe(
          response => {
            console.log('checkout id: ', response.checkoutId);
            window.location.href = "https://sandboxcheckout.rapyd.net/?token=" + response.checkoutId;
          },
          error => {
            console.error('Payment failed:', error);
          }
        );

      } else {
        // Handle the case where amount is not a valid number
        console.error('Invalid amount');
      }
    } else {
      // Handle invalid form
      console.error('Form is not valid');
    }
  }

}
