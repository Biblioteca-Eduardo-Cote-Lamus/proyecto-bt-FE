import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PickListModule } from 'primeng/picklist';
import { UbicationService } from '../../pages/services/ubication.service';
import { FormErros } from 'src/app/shared/api';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'app-ubication-form',
    standalone: true,
    imports: [
        ButtonModule,
        DropdownModule,
        PickListModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        ReactiveFormsModule,
        NgClass
    ],
    template: `
    
    <form class="p-4" [formGroup]="ubicationForm" (ngSubmit)="submit()">
            <div class="formgrid grid">
                <div class="field col-12 md:col-6 p-fluid">
                    <label for="ubication" class="block w-full">Ubicación</label>
                    <input
                        id="ubication"
                        pInputText
                        type="text"
                        formControlName="ubication"
                        placeholder="Carnets, pasillo 1..."
                        [ngClass]="{
                            'ng-invalid ng-dirty': errorByControl('ubication'),
                            'border-green-400': !ubicationForm.get('ubication').invalid
                        }"
                    />
                    @if(errorByControl('ubication')){ 
                        @for (error of errorsByControl('ubication'); track error) {
                            <p class="text-red-500 text-sm">
                                {{ error }}
                            </p>
                        } 
                    }
                </div>
                <div class="field col-12 md:col-6 p-fluid">
                    <label for="manager" class="block w-full"
                        >Encargado asignado</label
                    >
                    <p-dropdown
                        inputId="manager"
                        [options]="managersList"
                        optionLabel="fullName"
                        placeholder="Seleccione al encargado"
                        formControlName="manager"
                        [ngClass]="{
                            'ng-invalid ng-dirty': errorByControl('manager'),
                        }"
                        [styleClass]="getInputStyle('manager')" >

                        <ng-template pTemplate="selectedItem">
                            @if (ubicationForm.get('manager')) {
                                <div class="flex align-items-center gap-2">
                                    <img src="assets/shared/no-user.svg" style="width: 18px"/>
                                    <div>{{ ubicationForm.get('manager').value.fullName }}</div>
                                </div>
                            }
                        </ng-template>
                        <ng-template let-manager pTemplate="item">
                            <div class="flex align-items-center gap-2">
                                <img src="assets/shared/no-user.svg"style="width: 18px"/>
                                <div>{{ manager.fullName }}</div>
                            </div>
                        </ng-template>
                    </p-dropdown>
                    @if(errorByControl('manager')){ 
                        @for (error of errorsByControl('manager'); track error) {
                            <p class="text-red-500 text-sm">
                                {{ error }}
                            </p>
                        } 
                    }
                </div>

                <div class="field col-12 md:col-6 p-fluid">
                    <label for="totalBecas" class="block w-full"
                        >Total de becas asignados</label
                    >
                    <p-inputNumber
                        [styleClass]="'w-full'"
                        inputId="totalBecas"
                        mode="decimal"
                        [min]="1"
                        [max]="10"
                        formControlName="becas"
                        [ngClass]="{
                            'ng-invalid ng-dirty': errorByControl('becas'),
                        }"
                        inputStyleClass="{{ getInputStyle('becas')}}"
                    />
                    @if(errorByControl('becas')){ 
                        @for (error of errorsByControl('becas'); track error) {
                            <p class="text-red-500 text-sm">
                                {{ error }}
                            </p>
                        } 
                    }
                </div>
                <div class="field col-12 md:col-6 p-fluid">
                    <label
                        for="typeSchedule"
                        class="block w-full"
                        >Tipo de horario</label
                    >
                    <p-dropdown
                        inputId="typeSchedule"
                        [options]="scheduleType"
                        placeholder="Seleccione el tipo de horario"
                        formControlName="typeSchedule"
                        [ngClass]="{
                            'ng-invalid ng-dirty': errorByControl('typeSchedule'),
                        }"
                        [styleClass]="getInputStyle('typeSchedule')"
                        (onChange)="setScheduleHours($event)"
                    ></p-dropdown>
                    @if(errorByControl('typeSchedule')){ 
                        @for (error of errorsByControl('typeSchedule'); track error) {
                            <p class="text-red-500 text-sm">
                                {{ error }}
                            </p>
                        } 
                    }
                </div>

                <div class="field col-12 md:col-6 p-fluid">
                    <label
                        for="description"
                        class="block w-full"
                        >Descripcion del lugar</label
                    >
                    <textarea 
                        inputId="description"  
                        pInputTextarea 
                        formControlName="description" 
                        [autoResize]="true"
                        [rows]="3"
                        [ngClass]="{
                            'ng-invalid ng-dirty': errorByControl('description'),
                            'border-green-400': !ubicationForm.get('description').invalid
                        }">
                    </textarea>
                    @if(errorByControl('description')){ 
                        @for (error of errorsByControl('description'); track error) {
                            <p class="text-red-500 text-sm">
                                {{ error }}
                            </p>
                        } 
                    }
                </div>

                <div class="field col-12 md:col-6 p-fluid">
                    <label class="block w-full">
                        Foto de la ubicacion
                    </label>
                    <div class="border-2 border-dashed border-round surface-ground py-3  flex flex-column  justify-content-center align-items-center font-medium "
                            [ngClass]="{'border-green-400': ubicationForm.get('photo').value}">
                        <input
                            type="file"
                            class="hidden"
                            accept="image/*"
                            #photo
                            (change)="loadImage($event)"
                        />
                        <p-button
                            label="Seleccionar"
                            (onClick)="openImgFile()"
                            type="button"
                        ></p-button>
                    </div>
                </div>

                @if (showPickHours()) {
                    <div class="field col-12 ">
                        <label class="inline-block pb-4"
                            >Selecciona las horas
                        </label>
                        <p-pickList
                            [source]="sourceHours"
                            [target]="targetHours"
                            sourceHeader="Horas disponibles"
                            targetHeader="Horas asignadas"
                            [responsive]="true"
                            [sourceStyle]="{ height: '200px' }"
                            [targetStyle]="{ height: '200px' }"
                            (onMoveToTarget)="refres()"
                            (onMoveToSource)="refres()"
                            [dragdrop]="true"
                        >
                            <ng-template let-hour pTemplate="item">
                                <div
                                    class="flex flex-wrap p-2 align-items-center gap-3"
                                >
                                    <i
                                        class="pi pi-clock"
                                        style="font-size: 1.5rem"
                                    ></i>
                                    <div
                                        class="flex-1 flex flex-column gap-2"
                                    >
                                        <span class="font-bold">{{
                                            hour
                                        }}</span>
                                        <div
                                            class="flex align-items-center gap-2"
                                        >
                                            <span> {{ getTimeFormat(hour) }} </span>
                                        </div>
                                    </div>
                                    <span
                                        class="font-bold text-900"
                                    >
                                        <i
                                            class="pi pi-calendar"
                                            style="font-size: 1.5rem"
                                        ></i>
                                    </span>
                                </div>
                            </ng-template>
                        </p-pickList>
                    </div>
                }
            </div>
            <div class="flex justify-content-end mt-6">
                <p-button type="submit" label="Enviar" icon="pi pi-send" iconPos="right" [disabled]="ubicationForm.invalid"> </p-button>
            </div>
        </form>

    
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationFormComponent implements OnInit, FormErros {

    @Output() onSubmit = new EventEmitter();
    @Output() onFormChange = new EventEmitter();

    @ViewChild('photo') photoFile: ElementRef
    photoUbication!: File; 
    
    ubicationForm: FormGroup = this.fb.group({
        ubication: ['', [Validators.required, Validators.minLength(5)]],
        becas: [ 0, [Validators.required, Validators.min(1), Validators.max(10)],],
        manager: ['', [Validators.required]],
        typeSchedule: ['', [Validators.required]],
        schedule: ['', [Validators.required]],
        photo: [''],
        description: ['', [Validators.required]]
    });

    targetHours: string[] = [];
    sourceHours: string[] = [
        '06:00-07:00',
        '07:00-08:00',
        '08:00-09:00',
        '09:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00',
        '17:00-18:00',
        '18:00-19:00',
        '19:00-20:00',
        '20:00-21:00',
        '21:00-22:00',
    ];

    scheduleType = ['Oficina', 'Especial'] 

    managersList = []

    constructor(private fb: FormBuilder, private ubicationService: UbicationService){}

    ngOnInit(): void {

        this.ubicationForm.valueChanges.pipe(debounceTime(800)).subscribe((value) => {
            this.onFormChange.emit(value)
        })

        this.ubicationService.getManagerList().subscribe({
            next: ({data}: any) => {
                this.managersList = data
            }
        })
    }

    // Funcion para obtener los errores de un control del formulario
    errorsByControl(control: string) {
        const controlErrors = this.ubicationForm.get(control)?.errors;
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
                        errorMessages.push(
                            `Minimo ${controlErrors[error].requiredLength} caracteres para la justificación`
                        );
                        break;
                    default:
                        errorMessages.push('El valor ingresado no es valido');
                        break;
                }
            });
        }
        return errorMessages;
    }

    // Funcion para obtener si un control tiene errores
    errorByControl(control: string) {
        return (
            this.ubicationForm.get(control)?.invalid &&
            (this.ubicationForm.get(control)?.touched ||
                this.ubicationForm.get(control)?.dirty)
        );
    }

    /**
     * Funcion que determina si mostrar o no el picklist de horas
     * @returns boolean si se muestra o no el picklist 
     */
    showPickHours(){
        const value = this.ubicationForm.get('typeSchedule').value
        return value === this.scheduleType[1]
    }

    /**
     * Funcion para obtener el estilo del input en el template
     */
    getInputStyle(control: string){
        return (this.ubicationForm.get(control).touched && !this.ubicationForm.get(control).invalid) || !this.ubicationForm.get(control).invalid  ? 'w-full border-green-400' : 'w-full'
    }

    /**
     * Funcion para abrir el input file
     */
    openImgFile(){
        this.photoFile.nativeElement.click()
    }

    /**
     * Funcion para cargar la imagen en el formulario
     * @param event evento del input file
     */
    loadImage(event: any){
        const file = event.target.files[0]
        const reader = new FileReader()

        this.photoUbication = file

        reader.onload = (e) => {
            const photo = e.target.result
            this.ubicationForm.get('photo').setValue(photo)
        }

        reader.readAsDataURL(file)
    }

    // Funcion para refrescar las horas de trabajo desde el picklist
    refres() {
        this.ubicationForm.get('schedule').setValue(this.targetHours)
    }

    // Funcion para setear las horas de trabajo dado el tipo de horario
    setScheduleHours(event: any){
        const {value} = event

        // 0 = Oficina, 1 = Especial
        if(value === this.scheduleType[0]){
            this.ubicationForm.get('schedule').setValue([
                '08:00-09:00',
                '09:00-10:00',
                '10:00-11:00',
                '11:00-12:00',
                '14:00-15:00',
                '15:00-16:00',
                '16:00-17:00',
                '17:00-18:00',
            ])
        }

        if(value === this.scheduleType[1]){
            this.ubicationForm.get('schedule').setValue([])
        }
        
    }

    //funcion para obtener el formato de la hora en el picklist am/pm
    getTimeFormat(hour: string){
        return Number(hour.slice(0,2)) < 12 ? 'a.m.' : 'p.m.'
    }

    // funcion para enviar el formulario
    submit(){
        if(this.ubicationForm.invalid){
            return
        }

        const {ubication, becas, manager,typeSchedule, schedule, description} = this.ubicationForm.value
        
        const ubicationFormData = new FormData()

        ubicationFormData.append('ubication', JSON.stringify({
            ubication,
            becas,
            manager: manager.id,
            typeSchedule,
            schedule,
            description
        }))

        ubicationFormData.append('photo', this.photoUbication as Blob) 

        this.onSubmit.emit(ubicationFormData)       
    }


}
