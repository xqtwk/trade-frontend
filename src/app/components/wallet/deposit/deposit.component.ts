import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {StripeService} from "../../../services/stripe/stripe.service";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxStripeModule, StripeCardComponent, StripeService as AngularStripeService} from 'ngx-stripe';
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StripeCardComponent, FormsModule, MatDialogActions, MatDialogContent],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent implements AfterViewInit{
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  paymentForm = new FormGroup({
    cardholderName: new FormControl(''), // Already in your form
    cardNumber: new FormControl(''), // Add form control for card number
    expMonth: new FormControl(''), // Add form control for card expiration month
    expYear: new FormControl(''), // Add form control for card expiration year
    cvc: new FormControl('') // Add form control for card cvc
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

  constructor(private stripeService: StripeService, private angularStripeService: AngularStripeService) {}
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
      this.angularStripeService.createToken(this.card.element, { name: cardholderName }).subscribe(result => {
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
    const amount = 1000; // Replace with the actual amount
    const userId = '1'; // Replace with the actual user ID

    this.stripeService.topUpBalance(amount, userId, token).subscribe(
      response => {
        console.log('Payment successful:', response);
      },
      error => {
        console.error('Payment failed:', error);
        console.log('Full error object:', error);
      }
    );
  }

}
