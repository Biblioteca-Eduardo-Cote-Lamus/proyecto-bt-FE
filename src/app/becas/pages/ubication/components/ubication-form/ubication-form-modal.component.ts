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
            [style]="{ width: '90%', maxWidth: '630px', margin: 'auto' , boxShadow: 'none', overflow: 'auto' }"
            [draggable]="false"
            [resizable]="false"
            header="Informacion detallada"
            (onHide)="onClose()"
        >
            <!-- <ng-template pTemplate="headless"> -->
                <div class="bg-white border-round p-2 h-full">
                    <p-tabView [activeIndex]="0"> 
                        <p-tabPanel header="Información">
                            <app-ubication-form (onSubmit)="submit($event)"  [ubication]="ubication" (onFormChange)="saveForm($event)" />
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
     * Funcion para enviar el formulario
     */
    submit(event:any){
        this.onSubmit.emit(event)
        this.onClose() 
    }

    /**
     * Funcion para guardar los valores del formulario
     * @param event Evento que se dispara al cambiar los valores del formulario
     */
    saveForm(event:any){
        this.ubicationFormValue = event
        console.log(this.ubicationFormValue);
        
    }

    setSchedule(event:any){
        this.schedule = {
            schedule: event,
            valid: false,
        }
        // verificar si alguna de las horas en los dias es invalida
        this.schedule.valid = this.schedule.schedule.every((day:any) => day.hours.every((hour:any) => hour.valid))        
    }


}
