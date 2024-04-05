import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';


@Component({
    selector: 'app-register-form',
    standalone: true,
    imports: [
        CommonModule,
        StepperModule,
        InputTextModule,
        DropdownModule,
        ReactiveFormsModule
    ],
    template: `
        <section class="pt-3 pr-5 lg:pl-5">
           @if (activateViewCode === 1) {
                <div class="mb-4">
                    <h3 class="mb-1">Formulario de registro</h3>
                    <span>Rellene todos los campos con *</span>
                </div>
                <div>
                    <form>
                        <!-- Personal Data -->
                        <div class="mb-4">
                            <p class="font-bold text-2xl mb-4">1. Datos personales</p>
                            <!-- inputs -->
                            <div class="formgrid grid">
                                <span class="block mb-4 col-12 md:col-6 field col" >
                                    <label class="font-semibold pb-2 block" for="firstName">Nombres *</label>
                                    <input id="firstName" type="text" pInputText class="w-full"  />
                                </span>

                                <span class="block mb-4 col-12 md:col-6 field col">
                                    <label class="font-semibold pb-2 block" for="lastNames">Apellidos *</label>
                                    <input id="lastNames" type="text" pInputText class="w-full"  />
                                </span>

                                <span class="block mb-4 field col col-12 md:col-6">
                                    <label class="font-semibold pb-2 block" for="birthday">Fecha * nacimiento</label>
                                    <input id="birthday" type="date" pInputText class="w-full"  />
                                </span>

                                <span class="block mb-4 field col col-12 md:col-6">
                                    <label class="font-semibold pb-2 block" for="address">Dirección *</label>
                                    <input id="address" type="text" pInputText class="w-full"  />
                                </span>

                                <span class="block mb-4 field col col-12 md:col-6">
                                    <label class="font-semibold pb-2 block" for="address">Programa academico *</label>
                                <p-dropdown [styleClass]="'w-full'"> </p-dropdown>
                                </span>

                                <span class="block mb-4 field col col-12 md:col-6">
                                    <label class="font-semibold pb-2 block" for="address">Genero *</label>
                                <p-dropdown [styleClass]="'w-full'"> </p-dropdown>
                                </span>
                            </div>
                        </div>

                        <!-- Documents -->
                        <div>
                            <p class="font-bold text-2xl mb-3">2. Documentos necesario</p>
                            
                            <div class="formgrid grid">
                                <div class="mb-3 field col-12 md:col-6">
                                    <p class="font-semibold mb-2">
                                        Horario
                                        <span class="block font-normal">Descargue el formato del horario aquí</span>
                                    </p>
                                    <div class="border-2 border-dashed surface-border border-round surface-ground  flex justify-content-center align-items-center font-medium  h-8rem md:h-13rem">
                                        <input type="file" class="hidden">
                                        <button>Seleccionar</button>
                                    </div>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <p class="font-semibold mb-2">
                                        Foto
                                        <span class="block font-normal">Suba una foto de su rostro </span>
                                    </p>
                                    <div class="border-2 border-dashed surface-border border-round surface-ground  flex justify-content-center align-items-center font-medium  h-8rem md:h-13rem">
                                        <input type="file" class="hidden">
                                        <button class="mr-2">Seleccionar</button>
                                        <button>Tomar foto</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
           } @else if (activateViewCode  === 2) {
                <div class="card flex justify-content-center">
                    <p>Ya haz enviado el formulario de registro. Te informaremos del proximo avance </p>
                </div>
           } @else {
                <div class="card flex justify-content-center">
                    <p>El formulario de registro no esta disponible en este momento. </p>
                </div>
           }

        </section>
    `,
    styleUrl: './register-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {

    activateViewCode = -1

    constructor(private http: HttpClient, private fb: FormBuilder) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // get query params
        this.activateViewCode = this.getCode()
    }

    private getCode(){
        const code = Number(localStorage.getItem('canSend'));
        localStorage.removeItem('canSend');
        return code;
    }

 }
