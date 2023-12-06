import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";
import {StripeCardComponent, StripeService, StripeService as NgxStripeService} from "ngx-stripe";
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
import {StripeService as AngularStripeService} from "../../../services/stripe/stripe.service"
import {MiscService} from "../../../services/miscellaneous/misc.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerInputEvent, MatDatepickerModule} from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
declare var Plaid: any;
@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogActions, MatDialogContent, ReactiveFormsModule, StripeCardComponent, NgxPlaidLinkModule, MatFormFieldModule, MatDatepickerModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent implements OnInit {
  stripePromise: Promise<Stripe | null>;
  accessToken: string;
  item_id: string;
  accountForm: FormGroup;
  userIp: string = '';
  constructor(private plaidService: PlaidService, private userService: UserService,private fb: FormBuilder,
              private stripeService: StripeService, private angularStripeService: AngularStripeService,
              private miscService: MiscService) {
    this.stripePromise = loadStripe(publishableKey.publishableKey);
    this.accessToken = '';
    this.item_id = '';

    this.accountForm = this.fb.group({
      country: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      url: [''],
      tosIp: [''], // You might want to automate this
      tosDate: [''], // You might want to automate this
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dobDay: ['', Validators.required],
      dobMonth: ['', Validators.required],
      dobYear: ['', Validators.required],
      line1: ['', Validators.required],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      iban: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.miscService.getUserIp().subscribe(ip => {
      this.userIp = ip;
      console.log('User IP:', this.userIp);
      this.accountForm.patchValue({tosIp: this.userIp});
    }, error => {
      console.error('There was an error!', error);
    });
    this.miscService.getCurrentDate().subscribe(dateString => {
      this.accountForm.patchValue({ tosDate: dateString });
      console.log(dateString);
    }, error => {
      console.error('Error fetching current date:', error);
    });
    this.accountForm.patchValue({url: 'https://localhost:4200/profile/'+ this.userService.getUserNicknameFromToken()})


  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    if (date) {
      this.accountForm.patchValue({
        dobDay: date.getDate(),
        dobMonth: date.getMonth() + 1,
        dobYear: date.getFullYear()
      });
    }
  }
  onSubmit() {
    if (this.accountForm.valid) {
      const tosDate = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      this.accountForm.patchValue({ tosDate: tosDate }); // Set the timestamp in the form

      this.angularStripeService.createCustomAccount(this.accountForm.value).subscribe(
        response => {
          console.log('Account created successfully', response);
          // Handle successful response here
        },
        error => {
          console.error('Error creating account', error);
          // Handle errors here
        }
      );
    } else {
      console.log('Form is not valid');
    }
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

  /*async createBankAccountToken(): Promise<void> {
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
  }*/
}
