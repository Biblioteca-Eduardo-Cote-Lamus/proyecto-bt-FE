import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(LoginService).isLoggedIn() ? true : inject(Router).navigate(['login']);
};
