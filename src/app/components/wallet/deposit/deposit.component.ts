import {AfterViewInit, Component, Directive, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StripeService} from "../../../services/stripe/stripe.service";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxStripeModule, StripeCardComponent, StripeService as AngularStripeService} from 'ngx-stripe';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {UserService} from "../../../services/user/user.service";
import {CardTokenizedEvent} from "../../../models/card-tokenized-event";
import {CheckoutcomService} from "../../../services/checkoutcom/checkoutcom.service";
import {RapydService} from "../../../services/rapyd/rapyd.service";
import {DepositRequest} from "../../../models/deposit-request";
declare let Frames: any;

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StripeCardComponent, FormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;
  userId: string = '';

  paymentForm = new FormGroup({
    country: new FormControl('LT', [Validators.required]),
    amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])
  });

  ngOnInit() {
    this.el.nativeElement.setAttribute('tabindex', '-1');
    console.log("beforemethod")
  }

  constructor(private stripeService: StripeService,
              private rapydService: RapydService,
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

  private sendTokenToBackend(token: string): void {
    const amount = this.paymentForm.get('amount')?.value ?? null; // Updated this line
    if (this.userId && amount && amount > 0) {
      this.stripeService.topUpBalance(amount, this.userId, token).subscribe(
        response => {
          console.log('Payment successful:', response);
        },
        error => {
          console.error('Payment failed:', error);
        }
      );
    } else {
      console.error('Amount and User ID are required for payment');
      console.log("userid " + this.userId);
      console.log("amount " + amount)
    }
  }









 /* paymentForm: FormGroup;
  tokenizedCard: string | null = null; // Variable to store the tokenized card
  isSubmitting: boolean = false;

  constructor(private checkoutcomService: CheckoutcomService) {
    this.paymentForm = new FormGroup({
      cardholderName: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]) // Assuming amount is a decimal
    });
  }

  ngOnInit(): void {
    Frames.init("pk_sbox_qyr3mqaocwyp7iopxa4xi3cejy=");
    Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, (event: CardTokenizedEvent) => {
      this.tokenizedCard = event.token; // Store the tokenized card
      console.log("token" + this.tokenizedCard);
      this.pay(); // Call pay() after tokenization
    });
  }

  try() :void {
    const paymentData = {
      amount: 1000,
      token: "tokenlmao"
    };
    this.checkoutcomService.sendPayment(paymentData).subscribe(
      response => {
        console.log(response);
        // Additional success handling
      },
      error => {
        console.error(error);
        // Additional error handling
      },
      () => {

      }
    );
  }
  tokenizeCard(): void {
    // Always trigger Frames tokenization
    Frames.submitCard();
  }

  pay(): void {
    if (this.paymentForm.valid && this.tokenizedCard) {
      this.isSubmitting = true; // Disable the button

      const paymentData = {
        //amount: this.paymentForm.value.amount,
        //token: this.tokenizedCard
        amount: 1000,
        token: "tokenlmao"
      };

      this.checkoutcomService.sendPayment(paymentData).subscribe(
        response => {
          console.log(response);
          // Additional success handling
        },
        error => {
          console.error(error);
          // Additional error handling
        },
        () => {
          this.isSubmitting = false; // Re-enable the button
          this.tokenizedCard = null; // Reset tokenizedCard for new tokenization
        }
      );
    }
  }
*/
}
