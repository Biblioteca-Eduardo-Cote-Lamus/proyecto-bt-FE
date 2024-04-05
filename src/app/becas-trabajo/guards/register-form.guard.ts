import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

export const registerFormGuard: CanActivateFn = (route, state) => {
  return inject(HttpClient).get(`${environment.apiUrlBase}/selection/check-user-form/1152069`).pipe(
    map((response: any) => {
      localStorage.setItem('canSend', JSON.stringify(response.code));
        return true
    })
  )
};
