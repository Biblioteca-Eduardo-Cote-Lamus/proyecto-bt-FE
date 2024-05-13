import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private redirectUrl: string;

  constructor(private http: HttpClient, private router: Router, private auth: LoginService){}

  redirecTo(){
    const {rol, id} = this.auth.userValues

    if(rol.id === 1 || rol.id === 2){
      if(this.redirectUrl){
        this.router.navigate([this.redirectUrl], {replaceUrl: true})
        return
      }
      this.router.navigate(['/backoffice'], {replaceUrl: true})
      return
    }

    if(rol.id === 3) {
      this.http.get(`${environment.apiUrlBase}/selection/check-current-state-beca/${id}`).subscribe({
        next: ({currentState}:any) => {
          if(currentState === 2){
            this.router.navigate(['/registro-beca/formulario-registro'],{replaceUrl: true})
            return
          }
          if (currentState === 5){
            if(this.redirectUrl){
              this.router.navigate([this.redirectUrl], {replaceUrl: true})
              return
            }
            this.router.navigate(['/backoffice'], {replaceUrl: true})
            return
          }
          this.router.navigate([this.redirectUrl], {replaceUrl: true})
        }
      })

    }

  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string {
    return this.redirectUrl || '/login';
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }
}
