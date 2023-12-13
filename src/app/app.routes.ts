import {Routes} from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {PurchasesComponent} from "./components/purchases/purchases.component";
import {SalesComponent} from "./components/sales/sales.component";
import {GoodsComponent} from "./components/goods/goods.component";
import {CatalogComponent} from "./components/catalog/catalog.component";
import {ChatComponent} from "./components/messages/chat/chat.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileSettingsComponent} from "./components/profile/profileSettings/profileSettings.component";
import {RegistrationComponent} from "./components/auth/registration/registration.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {authGuard} from "./services/guard/auth.guard";
import {unauthGuard} from "./services/guard/unauth.guard";
import {WalletComponent} from "./components/wallet/wallet.component";
import {ChatListComponent} from "./components/messages/chatlist/chatlist.component";
import {MessagesComponent} from "./components/messages/messages.component";
import {AdminComponent} from "./components/admin/admin.component";
import {adminGuard} from "./services/guard/admin.guard";
import {GameComponent} from "./components/admin/game/game.component";
import {AssetComponent} from "./components/admin/asset/asset.component";
import {AssetTypeComponent} from "./components/admin/asset-type/asset-type.component";
import {CatalogGameComponent} from "./components/catalog/catalog-game/catalog-game/catalog-game.component";
import {TradeDetailsComponent} from "./components/trade/trade-details/trade-details.component";

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'orders/purchases', component: PurchasesComponent, canActivate: [authGuard]},
  {path: 'orders/sales', component: SalesComponent, canActivate: [authGuard]},
  {path: 'goods', component: GoodsComponent, canActivate: [authGuard]},
  {path: 'catalog', component: CatalogComponent, canActivate: [authGuard]},
  {path: 'catalog/:gameName', component: CatalogGameComponent, canActivate: [authGuard]},
  {path: 'messages', component: MessagesComponent, canActivate: [authGuard]},
  {path: 'chat/:username', component: ChatComponent, canActivate: [authGuard]},
  {path: 'profile/settings', component: ProfileSettingsComponent, canActivate: [authGuard]},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'register', component: RegistrationComponent, canActivate: [unauthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [unauthGuard]},
  {path: 'wallet', component: WalletComponent, canActivate: [authGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/games', component: GameComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/assets', component: AssetComponent, canActivate: [authGuard,adminGuard]},
  {path: 'admin/asset-types', component: AssetTypeComponent, canActivate: [authGuard,adminGuard]},
  {path: 'trade-details/:tradeId', component: TradeDetailsComponent, canActivate: [authGuard] }

];
