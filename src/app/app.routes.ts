import {Routes} from '@angular/router';
import {MainComponent} from "./main/main.component";
import {PurchasesComponent} from "./purchases/purchases.component";
import {SalesComponent} from "./sales/sales.component";
import {GoodsComponent} from "./goods/goods.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {MessagesComponent} from "./messages/messages.component";
import {ProfileComponent} from "./profile/profile.component";
import {ProfileSettingsComponent} from "./profileSettings/profileSettings.component";

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'orders/purchases', component: PurchasesComponent},
  {path: 'orders/sales', component: SalesComponent},
  {path: 'goods', component: GoodsComponent},
  {path: 'catalog', component: CatalogComponent},
  {path: 'messages', component: MessagesComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'profile/settings', component: ProfileSettingsComponent}
];
