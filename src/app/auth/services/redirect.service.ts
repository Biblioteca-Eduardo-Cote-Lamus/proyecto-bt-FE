import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {

  private redirectUrl: string;

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
