import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginData } from '../api/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  login(data: LoginData) {
    return this.http.post(`${environment.apiUrlBase}/auth/`, { email: data.email, password: data.password});
  }

}
