import {Routes} from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {PurchasesComponent} from "./components/purchases/purchases.component";
import {SalesComponent} from "./components/sales/sales.component";
import {GoodsComponent} from "./components/goods/goods.component";
import {CatalogComponent} from "./components/catalog/catalog.component";
import {MessagesComponent} from "./components/messages/messages.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileSettingsComponent} from "./components/profileSettings/profileSettings.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {LoginComponent} from "./components/login/login.component";
import {authGuard} from "./services/auth/auth.guard";
import {unauthGuard} from "./services/auth/unauth.guard";

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'orders/purchases', component: PurchasesComponent, canActivate: [authGuard]},
  {path: 'orders/sales', component: SalesComponent, canActivate: [authGuard]},
  {path: 'goods', component: GoodsComponent, canActivate: [authGuard]},
  {path: 'catalog', component: CatalogComponent, canActivate: [authGuard]},
  {path: 'messages', component: MessagesComponent, canActivate: [authGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
  {path: 'profile/settings', component: ProfileSettingsComponent, canActivate: [authGuard]},
  {path: 'register', component: RegistrationComponent, canActivate: [unauthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [unauthGuard]}
];
