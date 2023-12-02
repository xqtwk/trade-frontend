import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const httpsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (window.location.protocol === 'http:') {
    window.location.href = `https://${window.location.host}${state.url}`;
    return false;
  }
  return true;
};
