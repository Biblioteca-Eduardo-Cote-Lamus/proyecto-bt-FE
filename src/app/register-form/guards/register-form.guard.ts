import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { type CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { LoginService } from 'src/app/auth/services/login.service';
import { environment } from 'src/environments/environment';

export const registerFormGuard: CanActivateFn = (route, state) => {
  const {id} = inject(LoginService).userValues
  return inject(HttpClient).get(`${environment.apiUrlBase}/selection/check-user-form/${id}`).pipe(
    map( (res: any) => {
      route.queryParams = { code: res.code };
      return true
    })
  )
};
