import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { RedirectService } from '../services/redirect.service';

export const authGuard: CanActivateFn = (route, state) => {
  const redirect = inject(RedirectService).setRedirectUrl(state.url)
  return inject(LoginService).isLoggedIn() ? true : inject(Router).navigate(['login'], {replaceUrl: true});
};
