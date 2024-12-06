import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Manager, ManagerFormDTO } from '../../api';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { EncargadoService } from '../../pages/services/encargado.service';
import { CheckboxModule } from 'primeng/checkbox';

export type saveManger = {
  manager: Manager,
  action: 'save' | 'update'
}

@Component({
    selector: 'app-manager-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        PasswordModule,
        ButtonModule,
        CheckboxModule
    ],
    template: `
      <form [formGroup]="managerForm" class="p-fluid grid py-4" (ngSubmit)="submit()">
        <div class="field col-12 md:col-6 mb-0">
          <span class="p-float-label">
            <input id="firstName" 
              type="text" 
              pInputText 
              formControlName="firstName"
              [ngClass]="{'ng-invalid ng-dirty':  managerForm.get('firstName')?.touched && managerForm.get('firstName')?.errors }" />
            <label for="firstName">Nombre</label>
          </span>
          <small *ngIf="managerForm.get('firstName')?.errors?.['required'] && managerForm.get('firstName')?.touched" class="p-error">El nombre es requerido.</small>
          <small *ngIf="managerForm.get('firstName')?.errors?.['minlength']" class="p-error">El nombre debe tener al menos 5 caracteres.</small>
        </div>

        <div class="field col-12 md:col-6 mb-0">
          <span class="p-float-label">
            <input id="lastName" 
              type="text" 
              pInputText 
              formControlName="lastName"
              [ngClass]="{'ng-invalid ng-dirty':  managerForm.get('lastName')?.touched && managerForm.get('lastName')?.errors }" /> 
            <label for="lastName">Apellido</label>
          </span>
          <small *ngIf="managerForm.get('lastName')?.errors?.['required'] && managerForm.get('lastName')?.touched" class="p-error">El apellido es requerido.</small>
          <small *ngIf="managerForm.get('lastName')?.errors?.['minlength']" class="p-error">El apellido debe tener al menos 5 caracteres.</small>
        </div>

        @if(!manager){
          <div class="field col-12 md:col-6 mb-0">
            <span class="p-float-label">
              <input id="code" 
                type="number" 
                pInputText 
                formControlName="id"
                [ngClass]="{'ng-invalid ng-dirty':  managerForm.get('id')?.touched && managerForm.get('id')?.errors }" /> 
              <label for="code">Codigo</label>
            </span>
            <small *ngIf="managerForm.get('id')?.errors?.['id']" class="p-error">Ingrese un codigo valido.</small>
            <small *ngIf="managerForm.get('id')?.errors?.['required'] && managerForm.get('id')?.touched" class="p-error">El codigo es obligatorio.</small>
          </div>
        }

        <div class="field col-12  mb-0" [ngClass]="{'md:col-6': !manager}">
          <span class="p-float-label">
            <input id="email" 
              type="email" 
              pInputText 
              formControlName="email"
              [ngClass]="{'ng-invalid ng-dirty':  managerForm.get('email')?.touched && managerForm.get('email')?.errors }" /> 
            <label for="email">Correo electrónico</label>
          </span>
          <small *ngIf="managerForm.get('email')?.errors?.['required'] && managerForm.get('email')?.touched" class="p-error">El correo electrónico es requerido.</small>
          <small *ngIf="managerForm.get('email')?.errors?.['email']" class="p-error">Ingrese un correo electrónico válido.</small>
        </div>

        @if(manager){
          <!-- check para saber si quiere actualizar la contrasenia -->
          <div class="field col-12 mb-0">
            <p-checkbox 
              binary="true" 
              label="Actualizar contraseña" 
              formControlName="updatePassword" 
              [ngClass]="{'ng-invalid ng-dirty':  managerForm.get('updatePassword')?.touched && managerForm.get('updatePassword')?.errors }"
              (onChange)="changePassword()" />
          </div>
        } 

        @if(!manager || managerForm.get('updatePassword')?.value ){
          <div class="field col-12 mb-0" [ngClass]="{'class': true}">
            <span class="p-float-label">
              <p-password id="password" 
                formControlName="password" 
                [toggleMask]="true" 
                [feedback]="false"
                [ngClass]="{'ng-invalid ng-dirty':  managerForm.get('password')?.touched && managerForm.get('password')?.errors }"  />
              <label for="password">Contraseña</label>
            </span>
            <small *ngIf="managerForm.get('password')?.errors?.['required'] && managerForm.get('password')?.touched" class="p-error">La contraseña es requerida.</small>
            <small *ngIf="managerForm.get('password')?.errors?.['minlength']" class="p-error">La contraseña debe tener al menos 8 caracteres.</small>
          </div>
        }

        <div class="col-12">
          <button pButton 
              type="submit" 
              label="{{ manager ? 'Actualizar' : 'Guardar' }}" 
              [disabled]="managerForm.invalid" 
              class="p-button-raised" ></button>
        </div>
      </form>
          
    `,
    styles: `

  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerFormComponent implements OnInit {

  /**
   * @description Form builder service
   */
  fb = inject(FormBuilder)

  /**
   * @description Manager service
   */
  managerService = inject(EncargadoService)

  /**
   * @description Manager to edit
   */
  @Input() manager: Manager 

  /**
   * @description Event trigger to save the manager
   */
  @Output() saveManager: EventEmitter<saveManger> = new EventEmitter()

  managerForm = this.fb.group({
    id: [0, [Validators.required]],
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    lastName: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    updatePassword: [false]
  })

  ngOnInit(): void { 
    this.loadManagerInfoIntoForm()
  }

  /**
   * @description Carga la información del manager en el formulario si es enviado
   */
  loadManagerInfoIntoForm() {
    if (!this.manager) return 

    this.managerForm.patchValue({
      firstName: this.manager.firstName,
      lastName: this.manager.lastName,
      email: this.manager.email,
      id: this.manager.id,
      password: ''
    })

    // quitamos los valores de la contraseña
    this.managerForm.get('password').clearValidators()
    this.managerForm.get('password').updateValueAndValidity()

  }

  /**
   * @description Envia la peticion para guardar el manager y emite el evento 
   */
  submit(){ 
    if (this.managerForm.invalid) return 

    const manager: ManagerFormDTO  = {
      id: this.manager?.id || Number(this.managerForm.get('id').value),
      first_name: this.managerForm.get('firstName').value,
      last_name: this.managerForm.get('lastName').value,
      email: this.managerForm.get('email').value,
      password: this.managerForm.get('password').value,
      ubications: []
    }

    this.saveForm(manager)


  }

  /**
   * @description Cambia la validación de la contraseña cuando se esta editando un manager
   */
  changePassword(){

    if (this.managerForm.get('updatePassword').value) {
      this.managerForm.get('password').setValidators([Validators.required, Validators.minLength(8)])
    }else{
      this.managerForm.get('password').clearValidators()
    }
    this.managerForm.get('password').updateValueAndValidity()
  }

  private saveForm(managerDTO: ManagerFormDTO) {
    if (this.manager) {
      this.managerService.updateManager(managerDTO).subscribe({
        next: (manager) => {
            window.location.reload()
        }
      })
    } else {      
      this.managerService.saveManager(managerDTO).subscribe({
        next: (manager) => {
          this.saveManager.emit({
            manager,
            action: 'save'
          })
        }
      })
    }
  }

}
