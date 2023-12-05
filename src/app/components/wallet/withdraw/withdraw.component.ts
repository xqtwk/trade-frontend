import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {StripeCardComponent, StripeService as NgxStripeService} from "ngx-stripe";
import { NgxPlaidLinkModule } from "ngx-plaid-link";
import {
  loadStripe,
  Stripe,
  StripeCardElement,
} from "@stripe/stripe-js";
import {publishableKey} from "../../../../assets/publishableKey";
import {CustomBankAccountDetails} from "../../../models/custom-bank-account-details";
import {PlaidService} from "../../../services/plaid/plaid.service";
import {LinkTokenResponse} from "../../../models/link-token-response";
import {UserService} from "../../../services/user/user.service";
import {UsernameRequest} from "../../../models/username-request";
import {ExchangePublicTokenRequest} from "../../../models/exchange-public-token-request";
import {ExchangePublicTokenResponse} from "../../../models/exchange-public-token-response";
declare var Plaid: any;
@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogActions, MatDialogContent, ReactiveFormsModule, StripeCardComponent, NgxPlaidLinkModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent{
  stripePromise: Promise<Stripe | null>;
  accountHolderName: string;
  accountHolderType: string;
  iban: string;
  accessToken: string;
  item_id: string;
  constructor(private plaidService: PlaidService, private userService: UserService) {
    this.stripePromise = loadStripe(publishableKey.publishableKey);
    this.accountHolderName = '';
    this.accountHolderType = 'individual';
    this.iban = '';
    this.accessToken = '';
    this.item_id = '';
  }

  loadPlaidScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('plaid-script')) {
        return resolve();
      }
      const script = document.createElement('script');
      script.id = 'plaid-script';
      script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Failed to load Plaid script');
      document.body.appendChild(script);
    });
  }

  async initializePlaid() {
    try {
      await this.loadPlaidScript();
      const username = this.userService.getUserNicknameFromToken()
      console.log(username);
      if (!username) {
        throw new Error('Failed to retrieve username from  JWTtoken');
      }
      const usernameRequest: UsernameRequest = {
        username: username
      };
      /*const linkTokenResponse = await this.plaidService.createLinkToken(usernameRequest).toPromise();
      console.log(linkTokenResponse)
      if (!linkTokenResponse || !linkTokenResponse.linkToken) {
        throw new Error('Failed to retrieve link token');
      }*/
      const linkToken = await this.plaidService.createLinkToken(usernameRequest).toPromise();
      if (!linkToken) {
        throw new Error('Failed to retrieve link token');
      }
      const handler = (window as any).Plaid.create({
        token: linkToken,
        onSuccess: async (publicToken: string, metadata: any) => {
          const account_id = metadata.account_id;
          console.log("plaid account id: " + account_id);
          const exchangePublicTokenRequest: ExchangePublicTokenRequest = {
            publicToken: publicToken,
            username: username
          };
          this.plaidService.exchangePublicToken(exchangePublicTokenRequest).subscribe(
            (response: ExchangePublicTokenResponse) => {
              console.log('response:', response);
              console.log('Access Token:', response.access_token);
              console.log('token_id:', response.item_id);
              this.accessToken = response.access_token;
              this.item_id = response.item_id;
            },
            error => {
              console.error('Error:', error);
            }
          );
        },
        // Other handlers like onExit, onEvent...
      });

      handler.open();
    } catch (error) {
      console.error('Error initializing Plaid:', error);
    }
  }

  async createBankAccountToken(): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe initialization failed');
      return;
    }
    const bankAccountDetails: CustomBankAccountDetails = {
      country: 'DE', // use appropriate country code
      currency: 'eur', // use appropriate currency
      account_holder_name: this.accountHolderName,
      account_holder_type: this.accountHolderType,
      iban: this.iban,
    };

    stripe.createToken(bankAccountDetails as unknown as StripeCardElement).then(result => {
      if (result.error) {
        console.error(result.error.message);
        // Handle errors here
      } else {
        console.log('Bank account token: ', result.token.id);
        // Send this token to your backend for further processing
      }
    });
  }
}
