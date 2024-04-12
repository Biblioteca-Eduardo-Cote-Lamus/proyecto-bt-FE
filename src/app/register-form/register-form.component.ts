import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef, OnInit,
    signal,
    ViewChild
} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { programsAcademic } from './const/programs-academic.const';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { RegisterFormService } from './services/register-form.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipsModule } from 'primeng/chips';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { UnsavedForm } from './interfaces/unsaved-form';
import { FormComponent } from './components/form/form.component';

@Component({
    selector: 'app-register-form',
    standalone: true,
    imports: [
        CommonModule,
        StepperModule,
        InputTextModule,
        DropdownModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
        SelectButtonModule,
        ConfirmDialogModule,
        ChipsModule,
        InputTextareaModule,
        TooltipModule,
        FormComponent
    ],
    template: `
        <section class="w-full min-h-screen overflow-hidden">
            <div class="grid min-h-screen m-0">
                <div class=" col-12 lg:col-5 bg-red-500 flex flex-column justify-content-center align-items-center text-white text-center">
                    <img src="assets/register-form/Emails-pana.svg" alt="Imagen de registro de formulario" class="w-full">
                    <h1 class="text-white">¡Registra el formulario!</h1>
                    <span>Registra el formulario para continuar el proceso de seleccion</span>
                </div>
                <div class="p-5 lg:p-6 col-12  lg:col-7">
                    @if (!sendFormControls().loading && !sendFormControls().ok) {
                        <app-form (sendFormEvent)="sendForm($event)" (isDirty)="isDirty($event)" />
                    }
                    @if (sendFormControls().loading) {
                        <div class="flex flex-column gap-4 h-full justify-content-center align-items-center">
                            <h2>Estamos procesando la información...</h2>
                            <i class="pi pi-spin pi-spinner" style="font-size: 15rem"></i>
                        </div>
                    }
                    @if(!sendFormControls().loading && sendFormControls().ok){
                        <div class="flex flex-column  gap-4 h-full justify-content-center align-items-center">
                            <img src="assets/register-form/thanks.svg" alt="imagen de enviado correctamente el formulario" class="lg:w-30rem w-15rem">
                            <div class="text-center">
                                <h2 class="font-bold">Registro completado</h2>
                                <span>Hemos recibido la información suministrada. Te estaremos informando de tu proceso vía correo electrónico.</span>
                            </div>
                            <p-button label="Salir" [styleClass]="'w-10rem'" (onClick)="close()" /> 
                        </div>
                    }
                </div>
            </div>
        </section>
    `,
    styles: `
        :host {
            display: block;
        }   
        .container{
            width: 100%;
            max-width: 80%;
            margin: auto
        }    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent implements OnInit, UnsavedForm {

    activateViewCode!:number
    sendFormControls = signal({loading: false, ok: false, error: false})

    constructor(
        private activatedRoute: ActivatedRoute,
        private authService: LoginService,
        private router: Router,
        private registerFormService: RegisterFormService
    ) {}
    unSaveForm = false;

    ngOnInit(): void {
        // get query params
        this.activatedRoute.queryParams.subscribe(
            ({code}) => {
                if(code === 2)
                    this.router.navigate(['/registro-beca/formulario-enviado'])
                if(code === 3)
                    this.router.navigate(['/registro-beca/formulario-cerrado'])
            }
        );
    }
    
    sendForm(data: FormData){
        this.sendFormControls.update(last => ({...last, loading: true}))

        this.registerFormService.sendRegisterForm(data).subscribe({
            next: (res) => {
                this.sendFormControls.set({loading: false, ok:true, error:false})
            },
            error: (err) => {
                this.sendFormControls.set({loading: false, ok:false, error: true})
            }
        })
    }

    isDirty(event:boolean){
        this.unSaveForm = event
    }

    close(){
        this.unSaveForm = true
        this.authService.logout()
    }
}
