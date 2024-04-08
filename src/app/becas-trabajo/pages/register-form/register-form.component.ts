import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { programsAcademic } from './const/programs-academic.const';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

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
    ],
    template: `
        <section class="pt-3 pr-5 lg:pl-5">
            @if (activateViewCode === 1) {
            <div class="mb-4">
                <h3 class="mb-1">Formulario de registro</h3>
                <span>Rellene todos los campos con *</span>
            </div>
            <div>
                <form [formGroup]="registerForm">
                    <!-- Personal Data -->
                    <div class="mb-4">
                        <p class="font-bold text-2xl mb-4">
                            1. Datos personales
                        </p>
                        <!-- inputs -->
                        <div class="formgrid grid">
                            <span class="block mb-4 col-12 md:col-6 field col">
                                <label
                                    class="font-semibold pb-2 block"
                                    for="firstName"
                                    >Nombres *</label
                                >
                                <input
                                    id="firstName"
                                    type="text"
                                    pInputText
                                    class="w-full"
                                    formControlName="firstName"
                                    [ngClass]="{
                                        'ng-invalid ng-dirty':
                                        errorByControl('firstName'),
                                        
                                    }"
                                />
                                @if(errorByControl('firstName')){ @for (error of
                                errorsByControl('firstName'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </span>

                            <span class="block mb-4 col-12 md:col-6 field col">
                                <label
                                    class="font-semibold pb-2 block"
                                    for="lastNames"
                                    >Apellidos *</label
                                >
                                <input
                                    id="lastNames"
                                    type="text"
                                    pInputText
                                    class="w-full"
                                    formControlName="lastNames"
                                    [ngClass]="{
                                        'ng-invalid ng-dirty':
                                        errorByControl('lastNames'),
                                        
                                    }"
                                />
                                @if(errorByControl('lastNames')){ @for (error of
                                errorsByControl('lastNames'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </span>

                            <span class="block mb-4 field col col-12 md:col-6">
                                <label
                                    class="font-semibold pb-2 block"
                                    for="birthday"
                                    >Fecha nacimiento *</label
                                >
                                <p-calendar
                                    formControlName="birthday"
                                    [ngClass]="{
                                        'ng-invalid ng-dirty': errorByControl('birthday'),
                                    }"
                                    [iconDisplay]="'input'"
                                    [showIcon]="true"
                                    inputId="birthday"
                                    [styleClass]="'w-full'"
                                    placeholder="Seleccione su fecha de nacimiento"
                                    [maxDate]="maxDate"
                                ></p-calendar>
                                @if(errorByControl('birthday')){ @for (error of
                                errorsByControl('birthday'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </span>

                            <span class="block mb-4 field col col-12 md:col-6">
                                <label
                                    class="font-semibold pb-2 block"
                                    for="address"
                                    >Dirección *</label
                                >
                                <input
                                    id="address"
                                    type="text"
                                    pInputText
                                    class="w-full"
                                    formControlName="address"
                                    placeholder="Ej: Calle 123 # 123-123"
                                    [ngClass]="{
                                        'ng-invalid ng-dirty':
                                            errorByControl('address'),
                                        
                                    }"
                                />
                                @if(errorByControl('address')){ @for (error of
                                errorsByControl('address'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </span>

                            <span class="block mb-4 field col col-12 md:col-6">
                                <label
                                    class="font-semibold pb-2 block"
                                    for="academic"
                                    >Programa academico *</label
                                >
                                <p-dropdown
                                    [styleClass]="'w-full'"
                                    formControlName="academic"
                                    [options]="academicPrograms"
                                    placeholder="Seleccione el programa academico"
                                    [ngClass]="{
                                        'ng-invalid ng-dirty':
                                            errorByControl('academic'),
                                        
                                    }"
                                    inputId="academic"
                                    [filter]="true"
                                >
                                </p-dropdown>
                                @if(errorByControl('academic')){ @for (error of
                                errorsByControl('academic'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </span>

                            <span class="block mb-4 field col col-12 md:col-6">
                                <label class="font-semibold pb-2 block"
                                    >Genero *</label
                                >
                                <p-dropdown
                                    [styleClass]="'w-full'"
                                    formControlName="gender"
                                    [options]="[
                                        'Masculino',
                                        'Femenino',
                                        'Prefiero no responder'
                                    ]"
                                    placeholder="Seleccione su genero"
                                    [ngClass]="{
                                        'ng-invalid ng-dirty':
                                            errorByControl('gender'),
                                        
                                    }"
                                    inputId="gender"
                                >
                                </p-dropdown>
                                @if(errorByControl('gender')){ @for (error of
                                errorsByControl('gender'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </span>
                        </div>
                    </div>

                    <!-- Documents -->
                    <div>
                        <p class="font-bold text-2xl mb-3">
                            2. Documentos necesario
                        </p>

                        <div class="formgrid grid">
                            <div class="mb-3 field col-12 md:col-6">
                                <p class="font-semibold mb-2">
                                    Horario
                                    <span class="block font-normal"
                                        >Descargue el horario desde
                                        divisist.</span
                                    >
                                </p>
                                <div
                                    class="border-2 border-dashed border-round surface-ground  flex justify-content-center align-items-center font-medium  h-13rem"
                                    [ngClass]="{
                                        'border-green-400 flex-column gap-4':
                                            registerForm.get('schedule').value
                                    }"
                                >
                                    @if(!registerForm.get('schedule').value) {
                                    <input
                                        type="file"
                                        class="hidden"
                                        accept="application/pdf"
                                        formControlName="schedule"
                                        (change)="
                                            onSelectFile($event, 'schedule')
                                        "
                                        #schedule
                                    />
                                    } @else {
                                    <div
                                        class="w-full flex flex-column gap-2 justify-content-center align-items-center"
                                    >
                                        <i
                                            class="pi pi-check-circle text-green-400"
                                            style="font-size: 3rem;"
                                        ></i>
                                        <span
                                            >Horario seleccionado con
                                            éxito</span
                                        >
                                    </div>
                                    }
                                    <p-button
                                        label="Seleccionar"
                                        (onClick)="openFileBrowser('schedule')"
                                        type="button"
                                    ></p-button>
                                </div>
                                @if(errorByControl('schedule')){ @for (error of
                                errorsByControl('schedule'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </div>
                            <div class="field col-12 md:col-6">
                                <p class="font-semibold mb-2">
                                    Foto
                                    <span class="block font-normal"
                                        >Suba una foto de su rostro
                                    </span>
                                </p>
                                <div
                                    class="border-2 border-dashed border-round surface-ground  flex justify-content-center align-items-center font-medium  h-13rem "
                                    [ngClass]="{
                                        'border-green-400 flex-column gap-4':
                                            registerForm.get('photo').value
                                    }"
                                >
                                    @if(!registerForm.get('photo').value) {
                                    <input
                                        type="file"
                                        class="hidden"
                                        accept="image/*"
                                        formControlName="photo"
                                        (change)="onSelectFile($event, 'photo')"
                                        #photo
                                    />
                                    }@else {
                                    <div
                                        class="w-full flex flex-column gap-2 justify-content-center align-items-center"
                                    >
                                        <i
                                            class="pi pi-check-circle text-green-400"
                                            style="font-size: 3rem;"
                                        ></i>
                                        <span
                                            >Imagen seleccionada con éxito</span
                                        >
                                    </div>
                                    }
                                    <p-button
                                        label="{{
                                            registerForm.get('photo').value
                                                ? 'Cambiar'
                                                : 'Seleccionar'
                                        }}"
                                        (onClick)="openFileBrowser('photo')"
                                        type="button"
                                        [styleClass]="'mr-3'"
                                    ></p-button>
                                </div>
                                @if(errorByControl('photo')){ @for (error of
                                errorsByControl('photo'); track error) {
                                <p class="text-red-500 text-sm">
                                    {{ error }}
                                </p>
                                } }
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-content-end">
                        <p-button label="Enviar" icon="pi pi-send" iconPos="right" type="submit" [disabled]="registerForm.invalid"></p-button>
                    </div>
                </form>
            </div>
            } @else if (activateViewCode === 2) {
            <div class="card flex justify-content-center">
                <p>
                    Ya haz enviado el formulario de registro. Te informaremos
                    del proximo avance
                </p>
            </div>
            } @else {
            <div class="card flex justify-content-center">
                <p>
                    El formulario de registro no esta disponible en este
                    momento.
                </p>
            </div>
            }
        </section>
    `,
    styleUrl: './register-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
    @ViewChild('schedule') schedule?: ElementRef;
    @ViewChild('photo') photo?: ElementRef;

    activateViewCode!: number;
    academicPrograms = programsAcademic;

    registerForm = this.fb.group({
        firstName: [
            ' ',
            [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],
        ],
        lastNames: [
            ' ',
            [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],
        ],
        birthday: ['', [Validators.required]],
        address: [
            '',
            [Validators.required, Validators.pattern(/^[a-zA-Z0-9#\- ]+$/), Validators.minLength(10)],
        ],
        academic: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        schedule: [null, [Validators.required]],
        photo: [null, [Validators.required]],
    });

    selectedPhoto!: string;

    constructor(
        private fb: FormBuilder,
        private router: ActivatedRoute,
        private authService: LoginService,
        private cd: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // get query params
        this.router.queryParams.subscribe(
            ({ code }) => (this.activateViewCode = code)
        );
        this.authService.user$.subscribe((user) => {
            this.registerForm.patchValue({
                firstName: user.first_name.toLowerCase(),
                lastNames: user.last_name.toLowerCase(),
            });
        });
    }


    get maxDate() {
        return new Date()
    }

    errorsByControl(control: string) {
        const controlErrors = this.registerForm.get(control)?.errors;
        const errorMessages = [];
        if (controlErrors) {
            Object.keys(controlErrors).forEach((error) => {
                switch (error) {
                    case 'required':
                        errorMessages.push('Este campo es requerido');
                        break;
                    case 'pattern':
                        errorMessages.push('El valor ingresado no es valido');
                        break;
                    default:
                        break;
                }
            });
        }
        return errorMessages;
    }

    errorByControl(control: string) {
        return (
            this.registerForm.get(control)?.invalid &&
            (this.registerForm.get(control)?.touched ||
                this.registerForm.get(control)?.dirty)
        );
    }

    onSelectFile(event: any, control: string) {
        const file = event.target.files[0];

        if (
            (control == 'schedule' && file.type !== 'application/pdf') ||
            (control == 'photo' && file.type.indexOf('image') === -1)
        ) {
            this.registerForm.get(control)?.setErrors({ invalid: true });
            return;
        }

        if (control === 'photo') {
            this.showPhotoSelected(file);
        }

        this.registerForm.patchValue({
            [control]: file,
        });
    }

    openFileBrowser(control: string) {
        if (control === 'schedule') {
            this.schedule?.nativeElement.click();
        }

        if (control === 'photo') {
            this.photo?.nativeElement.click();
        }
    }

    showPhotoSelected(file: File) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            this.selectedPhoto = reader.result as string;
            this.cd.markForCheck();
        };
    }
}
