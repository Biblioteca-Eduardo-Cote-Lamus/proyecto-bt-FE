import {
    ChangeDetectionStrategy, Component, EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {
    FormBuilder, ReactiveFormsModule
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Modal } from 'src/app/shared/api';
import { Ubication } from '../../api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass } from '@angular/common';
import { UbicationService } from '../../pages/services/ubication.service';
import { UbicationFormComponent } from './ubication-form.component';
import { TabViewModule } from 'primeng/tabview';
import { UbicationScheduleComponent } from './ubication-schedule/ubication-schedule.component';
import { TYPES_SCHEDULE_KEYS } from './const/ubication-schedule.const'

@Component({
    selector: 'app-ubication-form-modal',
    standalone: true,
    imports: [
        DialogModule,
        ButtonModule,
        DropdownModule,
        UbicationFormComponent,
        UbicationScheduleComponent,
        ReactiveFormsModule,
        TabViewModule,
        NgClass,
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            maskStyle="backdrop-filter: blur(2px);"
            [style]="{ width: '90%', maxWidth: '750px', margin: 'auto' , boxShadow: 'none', overflow: 'auto' }"
            [draggable]="false"
            [resizable]="false"
            header="Informacion detallada"
            (onHide)="onClose()"
        >
            <!-- <ng-template pTemplate="headless"> -->
                <div class="bg-white border-round p-2 h-full">
                    <p-tabView [activeIndex]="0"> 
                        <p-tabPanel header="Información">
                            <app-ubication-form  [ubication]="ubication" (onFormChange)="saveForm($event)" />
                        </p-tabPanel>
                        <p-tabPanel header="Horario">
                            <ng-template pTemplate="content">
                                <app-ubication-schedule [becasAvailable]="ubicationFormValue?.becas || 0" (daysChange)="setSchedule($event)" />
                            </ng-template>
                        </p-tabPanel>    
                    </p-tabView>
                </div>
            <!-- </ng-template> -->
            <ng-template pTemplate="footer">
                <p-button 
                    label="Guardar" 
                    [outlined]="true" 
                    severity="secondary" 
                    [disabled]="ubicationFormValue.invalid || !schedule.valid"
                    (onClick)="submit()"
                />
                <p-button 
                    label="Cancelar" 
                    [text]="true" 
                    severity="secondary" 
                    (click)="visible = false" />
        </ng-template>
        </p-dialog>
    `,
    styles: `
        .conta{
            width: 100%;
            max-width: 600px;
            margin : auto;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationFormModalComponent implements Modal {

    @Input({ required: true }) visible: boolean = false;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
    @Input() ubication: Ubication | null | undefined;
    @Output() ubicationChange = new EventEmitter();
    @Output() onSubmit = new EventEmitter();

    ubicationFormValue: any = {
        invalid: true
    }

    schedule : any = {
        schedule: [],
        valid: false,
    }

    constructor(private fb: FormBuilder, private ubicationService: UbicationService) {}

    /**
     * Funcion para obtener el titulo del modal
     * @returns El titulo del modal
     */
    getTitle() {
        return this.ubication
            ? 'Edita la información'
            : 'Agrega una nueva ubicación';
    }

    /**
     * Funcion para cerrar el modal
     */
    onClose() {
        this.visibleChange.emit(false)
        this.ubicationChange.emit(null)
    }

    /**
     * Funcion para guardar los valores del formulario
     * @param event Evento que se dispara al cambiar los valores del formulario
     */
    saveForm(event:any){
        this.ubicationFormValue = event
    }

    /**
     * Funcion para guardar el horario
     * @param event Evento que se dispara al cambiar los valores del horario desde el componente ubicationSchedule
     */
    setSchedule(event:any){

        // si cambia el tipo de horario, se reinicia 
        if(this.schedule.scheduleType !== event.scheduleType){
            this.schedule = {
                schedule: [],
                valid: false,
                scheduleType: event.scheduleType   
            }
            return
        }

        // sino, se actualiza el horario
        this.schedule = {
            ...event,
            valid: false,
        }

        // verificar si alguna de las horas en los dias es invalida
        this.schedule.valid = this.schedule.schedule.every((day:any) => day.hours.every((hour:any) => hour.valid))        
    }

        
    /**
     * Funcion para enviar el formulario
     */
    submit(){
        const data = this.transformUbicationFormValue()

        // Determinamos si estamos creando o actualizando una ubicacion
        // if(this.ubication){
        //     this.onSubmit.emit({action: 'add', data})
        // }else {
        //     this.onSubmit.emit({action: 'update', data})
        // } 

        // this.onClose() 
    }


    /**
     * Funcion para crear el formdata a partir de los valores del formulario y enviarlo al backend
     */
    private transformUbicationFormValue() {
        // campos requeridos por el backend: ['ubication', 'becas', 'manager', 'typeSchedule', 'schedule', 'description']
        
        // desestructurar los valores del formulario
        const { ubication, becas, manager, photo, description } = this.ubicationFormValue

        //transformar el horario apartir del tipo
        const schedule = this.transformSchedule()

        // contruir el FormData para enviarlo al backend
        const formData = new FormData()

        // contruir el objeto con los datos del formulario
        const data = {
            ubication,
            becas,
            manager: manager.id,
            photo,
            description,
            schedule,
        }

        // agregamos los datos al formulario 
        formData.append('ubication', JSON.stringify(data))
        formData.append('photo', photo as Blob)

        // retornamos el formData 
        return formData
    }

    /**
     * Transforma el horario segun el tipo de horario
     * @returns el horario formateado segun el tipo de horario
     */
    private transformSchedule(){

        // extraemos el key del tipo de horario y el horario
        const {key} = this.schedule.scheduleType
        const {schedule} = this.schedule

        // Si es unificado sin sabado, se devolver un array de 2 posiciones, el primero corresponde a lahorario de lunes a viernes y el segundo a sabado
        if(key === TYPES_SCHEDULE_KEYS.unifiedWithoutSaturday) {
            
            return {
                scheduleType: key,
                schedule: [
                    {
                        days: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'],
                        hours: schedule[0].hours
                    },
                    {
                        days: ['sabado'],
                        hours: schedule[5].hours
                    }
                ]
            }

        }

        // Si es unificado con sabado, se devolver un array de 1 posicion, el cual corresponde al horario de lunes a sabado
        if(key === TYPES_SCHEDULE_KEYS.unifiedIncludingSaturday){
            return {
                scheduleType: key,
                schedule: [
                    {
                        days: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
                        hours: schedule[0].hours
                    }
                ]
                
            }
        }

        // Si es personalizado, se devolvera el horario tal cual
        return {
            scheduleType: key,
            schedule
        }
        
    }



}
