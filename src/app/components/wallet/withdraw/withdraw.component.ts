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
import {StripeCustomAccountCreateRequest} from "../../../models/stripe-custom-account-create-request";
import {CreateBankAccountTokenRequest} from "../../../models/create-bank-account-token-request";
import {CheckoutcomService} from "../../../services/checkoutcom/checkoutcom.service";

declare var Plaid: any;
@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogActions, MatDialogContent, ReactiveFormsModule, StripeCardComponent,
    NgxPlaidLinkModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent implements OnInit {
  stripePromise: Promise<Stripe | null>;
  accessToken: string;
  item_id: string;
  accountForm: FormGroup;
  userIp: string = '';
  account_id: string = '';
  customAccountCreated: boolean = false;
  constructor(private plaidService: PlaidService, private userService: UserService,private fb: FormBuilder,
              private stripeService: StripeService, private angularStripeService: AngularStripeService,
              private miscService: MiscService, private checkoutcomService: CheckoutcomService) {
    this.stripePromise = loadStripe(publishableKey.publishableKey);
    this.accessToken = '';
    this.item_id = '';
    this.accountForm = this.fb.group({
      country: ['LT', Validators.required], // Lithuania
      email: ['jonas@example.com', [Validators.required, Validators.email]],
      url: ['https://www.facebook.com/profile.php?id=100010201590777'],
      tosIp: ['192.168.1.1'], // Example IP, you might fetch the real IP
      tosDate: ['2023-03-21'], // Example date in YYYY-MM-DD format
      firstName: ['Jonas'],
      lastName: ['Jonaitis'],
      dob: [],
      dobDay: [15, Validators.required],
      dobMonth: [4, Validators.required], // April
      dobYear: [1985, Validators.required],
      line1: ['Gedimino pr. 9'],
      postalCode: ['01103'],
      city: ['Vilnius'],
      iban: ['LT601010012345678901'], // Example IBAN
      amount: [100, Validators.required] // Example amount
      /*
      country: ['LT', Validators.required],
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
      */
    });
  }

  countries = [
    { name: 'Lietuva', value: 'LT' },
    { name: 'Jungtinė Karalystė', value: 'GB' },
    { name: 'Ispanija', value: 'ES' },
    { name: 'Nyderlandai', value: 'NL' },
    { name: 'Prancūzija', value: 'FR' },
    { name: 'Airija', value: 'IE' },
    { name: 'Vokietija', value: 'DE' },
    { name: 'Italija', value: 'IT' },
    { name: 'Lenkija', value: 'PL' },
    { name: 'Danija', value: 'DK' },
    { name: 'Norvegija', value: 'NO' },
    { name: 'Švedija', value: 'SE' },
    { name: 'Estija', value: 'EE' },
    { name: 'Latvija', value: 'LV' },
    { name: 'Portugalija', value: 'PT' },
    { name: 'Belgija', value: 'BE' }
  ];
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
    //this.accountForm.patchValue({url: 'https://localhost:4200/profile/'+ this.userService.getUserNicknameFromToken()})


  }

  send() {



    /*const pay = {
      gad: "gad"
    };
    this.checkoutcomService.sendPayment(pay).subscribe(
      response => {
        console.log('payout created successfully');
        }, error => {
          console.log("Error happened during creating payout")
        });*/
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const selectedDate = new Date(this.accountForm.value.dob);
      console.log("selected date: " + selectedDate);
      const day = selectedDate.getDate();
      const month = selectedDate.getMonth() + 1; // getMonth() returns 0-11
      const year = selectedDate.getFullYear();
      this.accountForm.patchValue({ dobDay: day, dobMonth: month, dobYear: year}); // Set the timestamp in the form
      const formValue = this.accountForm.value;
      const stripeCustomAccountRequest: StripeCustomAccountCreateRequest = {
        country: formValue.country,
        email: formValue.email,
        url: formValue.url,
        tosIp: formValue.tosIp,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        dobDay: formValue.dobDay,
        dobMonth: formValue.dobMonth,
        dobYear: formValue.dobYear,
        line1: formValue.line1,
        postalCode: formValue.postalCode,
        city: formValue.city,
        iban: formValue.iban,
        amount: formValue.amount
      };

      this.angularStripeService.createCustomAccount(stripeCustomAccountRequest).subscribe(
        response => {
          console.log('Account created successfully', response);
          console.log("Succeed?");
          const createBankAccountTokenRequest: CreateBankAccountTokenRequest = {
            account_id: this.account_id
          }
            this.plaidService.createStripeBankAccountToken(createBankAccountTokenRequest).subscribe(response=> {
              console.log("stripe bank account token created successfully")
              console.log(response);
            }, error => {
              console.log("error happened during creating stripe bank account token")
            });
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
          this.account_id = metadata.account_id;
          console.log("plaid account id: " + this.account_id);
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
