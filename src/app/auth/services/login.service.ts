import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginData } from '../api/login';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoginResponse } from '../api/loginSuccessfull';
import { User } from '../api/User';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user: BehaviorSubject<User | undefined | null> = new BehaviorSubject<User | undefined | null>(null);

  constructor(
    private http: HttpClient
  ) { 
    const token = localStorage.getItem('token');
    if (token) {
      this.user.next(JSON.parse(localStorage.getItem('user') || '{}'));
    }
  }

  get user$(): Observable<User | undefined | null> { 
    return this.user.asObservable();
  }

  public login(data: LoginData): Observable<LoginResponse> {
    return this.http.post(`${environment.apiUrlBase}/auth/`, { email: data.email, password: data.password}).pipe(
      map((response: LoginResponse) => {
        this.user.next(response.data.user);
        return response;
      })
    );
  }

  public hasRol() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).access}`
    })
    return this.http.get(`${environment.apiUrlBase}/auth/hasAccess?rol=${this.user.getValue().rol.rol}&id=${this.user.getValue()?.id}`, {headers});
  }

  public logout(): void {
    localStorage.clear();
    this.user.next(null);
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null && this.user.getValue() !== null;
  }

}
