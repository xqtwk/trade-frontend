import {Routes} from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {PurchasesComponent} from "./components/purchases/purchases.component";
import {SalesComponent} from "./components/sales/sales.component";
import {CatalogComponent} from "./components/catalog/catalog.component";
import {ChatComponent} from "./components/messages/chat/chat.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileSettingsComponent} from "./components/profile/profileSettings/profileSettings.component";
import {RegistrationComponent} from "./components/auth/registration/registration.component";
import {LoginComponent} from "./components/auth/login/login.component";
import {authGuard} from "./services/guard/auth.guard";
import {unauthGuard} from "./services/guard/unauth.guard";
import {WalletComponent} from "./components/wallet/wallet.component";
import {MessagesComponent} from "./components/messages/messages.component";
import {AdminComponent} from "./components/admin/admin.component";
import {adminGuard} from "./services/guard/admin.guard";
import {GameComponent} from "./components/admin/game/game.component";
import {AssetComponent} from "./components/asset/asset.component";
import {AssetTypeComponent} from "./components/admin/asset-type/asset-type.component";
import {CatalogGameComponent} from "./components/catalog/catalog-game/catalog-game/catalog-game.component";
import {TradeComponent} from "./components/trade/trade.component";
import {CreateAssetComponent} from "./components/asset/create-asset/create-asset.component";
import {UpdateAssetComponent} from "./components/asset/update-asset/update-asset.component";
import {AssetDetailsComponent} from "./components/asset/asset-details/asset-details.component";
import {assetOwnerGuard} from "./services/guard/asset-owner.guard";

export const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'orders/purchases', component: PurchasesComponent, canActivate: [authGuard]},
  {path: 'orders/sales', component: SalesComponent, canActivate: [authGuard]},
  {path: 'catalog', component: CatalogComponent, canActivate: [authGuard]},
  {path: 'catalog/:gameName', component: CatalogGameComponent, canActivate: [authGuard]},
  {path: 'chat', component: MessagesComponent, canActivate: [authGuard]},
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
  {path: 'trade/:tradeId', component: TradeComponent, canActivate: [authGuard] },
  {path: 'assets', component: AssetComponent, canActivate: [authGuard] },
  {path: 'assets/new', component: CreateAssetComponent, canActivate: [authGuard] },
  {path: 'assets/:assetId', component: AssetDetailsComponent, canActivate: [authGuard] },
  {path: 'assets/update/:assetId', component: UpdateAssetComponent, canActivate: [authGuard, assetOwnerGuard] }
];
