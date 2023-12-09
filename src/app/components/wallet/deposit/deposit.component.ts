import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StripeService} from "../../../services/stripe/stripe.service";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxStripeModule, StripeCardComponent, StripeService as AngularStripeService} from 'ngx-stripe';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {UserService} from "../../../services/user/user.service";
import {CardTokenizedEvent} from "../../../models/card-tokenized-event";
import {CheckoutcomService} from "../../../services/checkoutcom/checkoutcom.service";
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
    cardholderName: new FormControl('', [Validators.required]),
    amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)])
  });
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };
  ngOnInit() {
    console.log("beforemethod")
    this.userService.getPrivateUserData().subscribe(
      response => {
        this.userId = response.id.toString();
        console.log("id" + response.id);
      },
      error => {
        console.error("Can't reach user data", error);
      }
    );
  }

  constructor(private stripeService: StripeService, private angularStripeService: AngularStripeService, private userService: UserService) {

  }

  ngAfterViewInit(): void {
    if (this.card.element) {
      this.card.element.on('change', (event) => {
        if (event.complete) {
          // Card Input is complete, you can query for token here
        } else if (event.error) {
          // Display any card error here
        }
      });
    }
  }

  pay(): void {
    const cardholderName = this.paymentForm.get('cardholderName')?.value ?? '';

    if (cardholderName) {
      this.angularStripeService.createToken(this.card.element, {name: cardholderName}).subscribe(result => {
        // Handle result.error or result.token
        if (result.token) {
          this.sendTokenToBackend(result.token.id);
          //  4242 4242 4242 4242 12/34 666
          console.log(result.token.id);
        } else if (result.error) {
          // Log the error
        }
      });
    } else {
      console.error('Card holder name is required');
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
