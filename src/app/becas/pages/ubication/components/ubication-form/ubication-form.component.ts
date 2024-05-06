import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
// import { PickListModule } from 'primeng/picklist';
import { UbicationService } from '../../pages/services/ubication.service';
import { FormErros } from 'src/app/shared/api';
import { debounceTime } from 'rxjs';
import { Ubication } from '../../api';
import { environment } from 'src/environments/environment';
import { BecasAssignValidator } from './validators/check-becas-asigned.validator';

@Component({
    selector: 'app-ubication-form',
    standalone: true,
    imports: [
        ButtonModule,
        DropdownModule,
        // PickListModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        ReactiveFormsModule,
        NgClass
    ],
    template: `
    
    <form class="" [formGroup]="ubicationForm" (ngSubmit)="submit()">
            <div class="formgrid grid">
                <div class="field col-12  p-fluid">
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
                <div class="field col-12  p-fluid">
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

                <div class="field col-12  p-fluid">
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

                <div class="field col-12 p-fluid">
                    <label class="block w-full">
                        Foto de la ubicacion
                    </label>
                    <div class="border-2 border-dashed border-round  py-3  flex flex-column  justify-content-center align-items-center font-medium "
                            [ngClass]="{'border-green-400': ubicationForm.get('photo').value, 'border-gray-300': !ubicationForm.get('photo').value}">
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

                <div class="field col-12 p-fluid">
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

            </div>
            <!-- <div class="flex justify-content-end mt-6">
                <p-button type="submit" label="Enviar" icon="pi pi-send" iconPos="right" [disabled]="ubicationForm.invalid"> </p-button>
            </div> -->
    </form>

    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationFormComponent implements OnInit, FormErros {

    @Output() onSubmit = new EventEmitter();
    @Output() onFormChange = new EventEmitter();
    @Input() ubication: Ubication | null | undefined;

    @ViewChild('photo') photoFile: ElementRef
    photoUbication!: File; 
    
    ubicationForm: FormGroup = this.fb.group({
        ubication: ['', [Validators.required, Validators.minLength(5)]],
        becas: [ 0, [Validators.required, Validators.min(1), Validators.max(10)],  ],
        manager: ['', [Validators.required]],
        photo: [''],
        description: ['', [Validators.required]]
    });

    scheduleType = ['Oficina', 'Especial'] 

    managersList = []

    constructor(
        private fb: FormBuilder, 
        private ubicationService: UbicationService,
        private assignBecasValidator: BecasAssignValidator
    ){}

    ngOnInit(): void {

        if(this.ubication){
            const { name, totalBecas, manager,  description, img } = this.ubication

            this.ubicationForm.patchValue({
                ubication: name,
                becas: totalBecas,
                manager: {
                    fullName: manager.name,
                    ...manager
                },
                description,
                photo: `${environment.apiUrlBase}${img}`
            })

            this.onFormChange.emit(this.ubicationForm.value)

            this.ubicationForm.get('becas').disable()
            this.ubicationForm.get('ubication').disable()
        }

        if(!this.ubication){
            this.ubicationForm.get('becas').addAsyncValidators(this.assignBecasValidator as any)
        }

        this.ubicationForm.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
            this.onFormChange.emit({...value, photo: this.photoUbication, invalid: this.ubicationForm.invalid})
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
                        errorMessages.push(controlErrors[error]);
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

    //funcion para obtener el formato de la hora en el picklist am/pm
    getTimeFormat(hour: string){
        return Number(hour.slice(0,2)) < 12 ? 'a.m.' : 'p.m.'
    }

    // funcion para enviar el formulario
    submit(){
        if(this.ubicationForm.invalid){
            return
        }

        if(!this.ubication){
            this.registerNewUbication()
            return
        }

        if(this.ubication){
            this.updatedUbication()
            return
        }

       
    }

    /**
     * Funcion para registrar una nueva ubicacion
     */
    registerNewUbication(){
        const {ubication, becas, manager, description} = this.ubicationForm.value
        
        const ubicationFormData = new FormData()

        ubicationFormData.append('ubication', JSON.stringify({
            ubication,
            becas,
            manager: manager.id,
            description
        }))

        ubicationFormData.append('photo', this.photoUbication as Blob) 

        this.onSubmit.emit({action: 'add', data: ubicationFormData})       
    }


    /**
     * Funcion para actualizar la ubicacion
     */
    updatedUbication(){
        const {description, manager} = this.ubicationForm.value

        const form = new FormData()

        form.append('ubication', JSON.stringify({
            description,
            manager: manager.id,
            id: this.ubication.id
        }))

        if (this.photoUbication)
            form.append('photo', this.photoUbication as Blob)

        this.onSubmit.emit({action: 'update', data: form})
        
    }


}
