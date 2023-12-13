import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "../user/user.service";
import {inject, Inject} from "@angular/core";

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);

  const role = userService.getUserRoleFromToken();
  if (role === 'ADMIN') {
    return true;
  }
  router.navigate(['/']);
  return false;
};
