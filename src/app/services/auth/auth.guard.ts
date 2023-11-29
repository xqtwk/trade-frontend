import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../authentication.service";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  if (!authService.isAuthenticatedValue) {
    router.navigate(['login']);
    return false;
  }
  return true;
};
