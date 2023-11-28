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

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'orders/purchases', component: PurchasesComponent},
  {path: 'orders/sales', component: SalesComponent},
  {path: 'goods', component: GoodsComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/settings', component: ProfileSettingsComponent},
  {path: 'auth/register', component: RegistrationComponent},
  {path: 'auth/authenticate', component: LoginComponent}
];
