import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { programsAcademic } from '../../const/programs-academic.const';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
// import { RegisterFormService } from './services/register-form.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipsModule } from 'primeng/chips';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { RegisterFormService } from '../../services/register-form.service';
import { debounceTime } from 'rxjs';
// import { UnsavedForm } from './interfaces/unsaved-form';

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [
        CommonModule,
        InputTextModule,
        DropdownModule,
        ReactiveFormsModule,
        ButtonModule,
        CalendarModule,
        SelectButtonModule,
        ConfirmDialogModule,
        ChipsModule,
        InputTextareaModule,
        TooltipModule
    ],
    template: `                        
        <div class="mb-4">
            <h3 class="mb-1">Formulario de registro</h3>
            <span>Rellene todos los campos con *</span>
        </div>
        <div>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
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
                                    'ng-invalid ng-dirty': errorByControl('firstName'),
                                    'border-green-400': !registerForm.get('firstName').invalid
                                }"
                            />
                            @if(errorByControl('firstName')){ 
                                @for (error of errorsByControl('firstName'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
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
                                    'ng-invalid ng-dirty': errorByControl('lastNames'),
                                    'border-green-400': !registerForm.get('firstName').invalid
                                }"
                            />
                            @if(errorByControl('lastNames')){ 
                                @for (error of errorsByControl('lastNames'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
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
                                [inputStyleClass]="(registerForm.get('birthday').touched && !registerForm.get('birthday').invalid) || !registerForm.get('birthday').invalid ? 'border-green-400':''"
                                placeholder="Seleccione su fecha de nacimiento"
                                [maxDate]="maxDate"
                            ></p-calendar>
                            @if(errorByControl('birthday')){ 
                                @for (error of errorsByControl('birthday'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
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
                                    'ng-invalid ng-dirty': errorByControl('address'),
                                    'border-green-400': !registerForm.get('address').invalid
                                }"
                            />
                            @if(errorByControl('address')){ 
                                @for (error of errorsByControl('address'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
                        </span>

                        <span class="block mb-4 field col col-12 md:col-6">
                            <label
                                class="font-semibold pb-2 block"
                                for="academic"
                                >Programa academico *</label
                            >
                            <p-dropdown
                                [styleClass]="(registerForm.get('academic').touched && !registerForm.get('academic').invalid) || !registerForm.get('academic').invalid  ? 'w-full border-green-400' : 'w-full'"
                                formControlName="academic"
                                [options]="academicPrograms"
                                placeholder="Seleccione el programa academico"
                                [ngClass]="{
                                    'ng-invalid ng-dirty': errorByControl('academic'),
                                }"
                                inputId="academic"
                                [filter]="true"
                            >
                            </p-dropdown>
                            @if(errorByControl('academic')){ 
                                @for (error of errorsByControl('academic'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
                        </span>

                        <span class="block mb-4 field col col-12 md:col-6">
                            <label class="font-semibold pb-2 block">Genero *</label>
                            <p-dropdown
                                [styleClass]="(registerForm.get('gender').touched && !registerForm.get('gender').invalid) || !registerForm.get('gender').invalid  ? 'w-full border-green-400' : 'w-full'"
                                formControlName="gender"
                                [options]="[
                                    'Masculino',
                                    'Femenino',
                                    'Prefiero no responder'
                                ]"
                                placeholder="Seleccione su genero"
                                [ngClass]="{
                                    'ng-invalid ng-dirty': errorByControl('gender'),
                                }"
                                inputId="gender"
                            >
                            </p-dropdown>
                            @if(errorByControl('gender')){ 
                                @for (error of errorsByControl('gender'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
                        </span>

                        <span class="block mb-4 field col col-12 md:col-6">
                            <label for="extras" class="font-semibold pb-2 block">Motivacion*</label>
                            <textarea class="w-full"  
                                    cols="30" 
                                    pInputTextarea 
                                    formControlName="motivation" 
                                    [autoResize]="true" 
                                    placeholder="Me gustaria ser parte de la biblioteca por que..."
                                    [ngClass]="{'border-green-400': !registerForm.get('motivation').invalid}">
                            </textarea>
                            @if(errorByControl('motivation')){ 
                                @for (error of errorsByControl('motivation'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
                        </span>

                        <span class="block mb-4 field col col-12 md:col-6 p-fluid">
                            <label for="extras" class="font-semibold pb-2 block">Formación extra</label>
                            <p-chips [inputStyleClass]="'w-full border-green-400'" 
                                    pTooltip="Separe por comas (,). Si no tiene, dejar vacio" 
                                    tooltipPosition="top"  
                                    separator="," 
                                    formControlName="studies" 
                                    placeholder="Técnico en sistemas, técnologo en administracion, ...">
                            </p-chips>
                            <span class="font-semibold" style="font-size: 10px;">No incluya el bachiderato</span>
                            @if(errorByControl('studies')){ 
                                @for (error of errorsByControl('studies'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
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
                                Horario *
                                <span class="block font-normal">Descargue el horario desde divisist.</span>
                            </p>
                            <div class="border-2 border-dashed border-round surface-ground  flex flex-column gap-4 justify-content-center align-items-center font-medium  h-13rem"
                                [ngClass]="{
                                    'border-green-400 ':filesConstrols[0]().ok,
                                    'border-red-500': filesConstrols[0]().error
                                }"
                            >
                                <input
                                    type="file"
                                    class="hidden"
                                    accept="application/pdf"
                                    (input)=" onSelectFile($event, 'schedule')"
                                    #schedule
                                />

                                @if (filesConstrols[0]().loading) {
                                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                                } 
                                @if(filesConstrols[0]().ok) {
                                    <div  class="w-full flex flex-column gap-2 justify-content-center align-items-center ">
                                        <i class="pi pi-check-circle text-green-400" style="font-size: 3rem;"></i>
                                        <span class="text-center">Horario seleccionado con éxito</span>
                                    </div>
                                }
                                @if(filesConstrols[0]().error) {
                                    <div  class="w-full flex flex-column gap-2 justify-content-center align-items-center">
                                        <i class="pi pi-times text-red-500" style="font-size: 3rem;"></i>
                                        <span class="text-center text-red-400">El documento no corresponde con el esperado.</span>
                                    </div>
                                }
                                @if ((!filesConstrols[0]().loading && !filesConstrols[0]().ok) || filesConstrols[0]().ok) {
                                    <p-button
                                        label="Seleccionar"
                                        (onClick)="openFileBrowser('schedule')"
                                        type="button"
                                    ></p-button>
                                }
                            </div>
                            @if(errorByControl('schedule')){ 
                                @for (error of errorsByControl('schedule'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
                        </div>

                        <div class="mb-3 field col-12 md:col-6">
                            <p class="font-semibold mb-2">
                                Foto *
                                <span class="block font-normal">Seleccione una foto de su cara.</span>
                            </p>
                            <div class="border-2 border-dashed border-round surface-ground  flex flex-column gap-4 justify-content-center align-items-center font-medium  h-13rem"
                                [ngClass]="{
                                    'border-green-400 ':filesConstrols[1]().ok,
                                    'border-red-500': filesConstrols[1]().error
                                }"
                            >
                                <input
                                    type="file"
                                    class="hidden"
                                    accept="image/*"
                                    (input)="onSelectFile($event, 'photo')"
                                    #photo
                                />

                                @if (filesConstrols[1]().loading) {
                                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                                } 
                                @if(filesConstrols[1]().ok) {
                                    <div  class="w-full flex flex-column gap-2 justify-content-center align-items-center">
                                        <i class="pi pi-check-circle text-green-400" style="font-size: 3rem;"></i>
                                        <span>Foto seleccionada con éxito</span>
                                    </div>
                                }
                                @if ((!filesConstrols[1]().loading && !filesConstrols[1]().ok) || filesConstrols[1]().ok) {
                                    <p-button
                                        label="Seleccionar"
                                        (onClick)="openFileBrowser('photo')"
                                        type="button"
                                    ></p-button>
                                }
                            </div>
                            @if(errorByControl('photo')){ 
                                @for (error of errorsByControl('photo'); track error) {
                                    <p class="text-red-500 text-sm">
                                        {{ error }}
                                    </p>
                                } 
                            }
                        </div>
                        
                    </div>
                </div>
                <div class="mt-6 flex justify-content-end">
                    <p-button
                        label="Enviar"
                        icon="pi pi-send"
                        iconPos="right"
                        type="submit"
                        [disabled]="registerForm.invalid"
                    ></p-button>
                </div>
            </form>
        </div>
    `,
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent { 
    

    @ViewChild('schedule') schedule?: ElementRef;
    @ViewChild('photo') photo?: ElementRef;
    @Output() sendFormEvent = new EventEmitter<FormData | null | undefined>()
    

    // 0: schedule, 1: photo
    filesConstrols = [signal({file:null, loading: false, ok: false, error: false}), signal({file:null, loading: false, ok: false, error: false})]
    academicPrograms = programsAcademic;
    registerForm = this.fb.group({
        firstName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],],
        lastNames: ['',[Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)],],
        birthday: ['', [Validators.required]],
        academic: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        schedule: [null, [Validators.required]],
        photo: [null, [Validators.required]],
        studies: [''],
        motivation: ['', [Validators.required, Validators.minLength(50)]],
        address: [
            '',
            [
                Validators.required,
                Validators.pattern(/^[a-zA-Z0-9#\- ]+$/),
            ],
        ],
    });

    @Output() isDirty = new EventEmitter<boolean>(this.registerForm.dirty);

    constructor(
        private fb: FormBuilder,
        private authService: LoginService,
        private registerFormService: RegisterFormService,
    ) {}

    ngOnInit(): void {

        if(localStorage.getItem('registerForm')){
            const value = JSON.parse(localStorage.getItem('registerForm')!)
            this.registerForm.patchValue({
                ...value,
                photo: null,
                schedule: null,
                birthday: new Date(value.birthday)
            })
        }

        this.authService.user$.subscribe((user) => {
            this.registerForm.patchValue({
                firstName: user.first_name,
                lastNames: user.last_name,
            });
        });

        this.registerForm.valueChanges.pipe(debounceTime(500)).subscribe({
            next: (value) => {
                localStorage.setItem('registerForm', JSON.stringify(value));
                this.isDirty.emit(this.unSavedForm())    
            }
        })

    }

    get maxDate() {
        return new Date();
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
                    case 'minlength':
                        errorMessages.push('Minimo 50 caracteres para la justificación');
                        break;
                    default:
                        errorMessages.push('El valor ingresado no es valido');
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
        try {
            const file = event.target.files[0];

            if ( (control == 'schedule' && file.type !== 'application/pdf') || (control == 'photo' && file.type.indexOf('image') === -1) ) {
                this.registerForm.get(control)?.setErrors({ invalid: true });
                return;
            }

            if(control == 'schedule'){
                this.filesConstrols[0].set({file, loading: true, ok: false, error: false})
                this.validateFile()
                return
            }

           if(control == 'photo'){
                this.filesConstrols[1].set({file, loading: false, ok: true, error:false})
                this.registerForm.patchValue({
                    'photo': this.filesConstrols[1]().file.name,
                });
           }

        } catch (error) {}
    }

    validateFile() {
        this.registerFormService
            .checkScheduleFile(this.filesConstrols[0]().file)
            .subscribe({
                next: (res) => {
                    this.filesConstrols[0].update(last => ({...last, loading:false, ok:true}))
                    this.registerForm.patchValue({
                        'schedule': this.filesConstrols[0]().file.name,
                    });
                },
                error: (err) => this.filesConstrols[0].set({file:null, loading:false, ok:false, error: true})
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

    onSubmit() {
        
        if(this.registerForm.invalid) {
            this.registerForm.markAllAsTouched()
            this.registerForm.markAsDirty()
            return 
        }

        const studies = this.registerForm.value.studies as any;
        const data = {
            names: this.registerForm.value.firstName,
            last_names: this.registerForm.value.lastNames,
            birthday: new Date(this.registerForm.value.birthday),
            address: this.registerForm.value.address,
            academic: this.registerForm.value.academic,
            gender: this.registerForm.value.gender,
            motivation: this.registerForm.value.motivation,
            studies: studies.join(', '),
            id: JSON.parse(localStorage.getItem('user')).id
        }
        const formData = new FormData();
        const [schedule, photo] = this.filesConstrols
        formData.append('schedule', schedule().file)
        formData.append('photo', photo().file)
        formData.append('data', JSON.stringify(data))    

        this.sendFormEvent.emit(formData)
        
    }

    unSavedForm() {
        return this.registerForm.dirty;
    };


}
