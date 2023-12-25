import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../auth/authentication.service";
import {AssetService} from "../asset/asset.service";
import {UserService} from "../user/user.service";

export const assetOwnerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const assetService = inject(AssetService);
  const userService = inject(UserService);
  const assetId = Number(route.paramMap.get('assetId'));
  return assetService.getAsset(assetId).toPromise().then(asset => {
    if (!asset) {
      // Redirect if the asset is not found
      router.navigate(['/assets']);
      return false;
    }
    return userService.getPublicUserData(userService.getUserNicknameFromToken()).toPromise().then(userData => {
      if (!userData) {
        // Redirect if the asset is not found
        router.navigate(['/assets']);
        return false;
      }
      if (asset.user.id === userData.id) {
        return true;
      }
      // Redirect or handle unauthorized access
      router.navigate(['/assets']);
      return false;
    });
  });

};
