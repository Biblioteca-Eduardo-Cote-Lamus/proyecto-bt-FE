import { HttpClient } from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export const registerFormGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(HttpClient).get(`${environment.apiUrlBase}/selection/check-user-form/1152069`).pipe(
    map((response: any) => {
      localStorage.setItem('canSend', JSON.stringify(response.code));
      route.queryParams = { code: response.code };
      return true
    })
  )
};
