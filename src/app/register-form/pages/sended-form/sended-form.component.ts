import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
    selector: 'app-sended-form',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `
      <main class="w-full min-h-screen overflow-hidden bg-red-600 flex flex-column justify-content-center align-items-center">
        <div class="grid container">
          <div class="col-12 md:col-6 flex justify-content-center align-items-center">
              <img src="assets/register-form/sended.png" alt="imagen de astronauta en cohete" class="w-full">
          </div>
          <div class="col-12 md:col-6 text-white text-center md:text-left  flex flex-column justify-content-center align-items-center">
            <h1 class="text-white xl:text-8xl">¡Ya te has registrado!</h1>
            <p class="line-height-4">Parece ser que estas queriendo enviar de nuevo el formulario. Tranquilo, mas adelante podras cambiarlo si asi deseas. Ten paciencia, te estaremos informando de tu proceso por correo electronico</p>
            <button class="align-self-start btn" (click)="backToHome()">Volver</button>
          </div>
        </div>
      </main>
    `,
    styles: `
    :host {
      display: block;
    }
    .container{
      width: 100%;
      max-width: 1100px;
      margin:auto
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendedFormComponent { 

  constructor(
    private authService: LoginService
  ){}

  backToHome(){
    this.authService.logout()
  }

}
