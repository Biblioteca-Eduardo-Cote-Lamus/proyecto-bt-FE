import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
    selector: 'app-close-form',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `
      <main class="w-full min-h-screen overflow-hidden bg-red-600 flex flex-column justify-content-center align-items-center">
        <div class="grid container">
          <div class="col-12 md:col-6 flex justify-content-center align-items-center">
              <img src="assets/register-form/close.png" alt="imagen de astronauta en cohete" class="w-full">
          </div>
          <div class="col-12 md:col-6 text-white text-center md:text-left  flex flex-column justify-content-center align-items-center">
            <h1 class="text-white xl:text-8xl">¡El formulario caduco!</h1>
            <p class="line-height-4">Parece ser que no alcanzaste a enviar el formulario a tiempo. Te informaremos por correo electrónico si el formulario vuelve a estar activo.</p>
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
export class ClosedFormComponent {

  constructor(
    private authService: LoginService
  ){}

  backToHome(){
    this.authService.logout()
  }
 }
