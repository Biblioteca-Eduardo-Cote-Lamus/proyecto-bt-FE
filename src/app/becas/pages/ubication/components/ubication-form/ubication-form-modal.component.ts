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
import { PickListModule } from 'primeng/picklist';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { Modal } from 'src/app/shared/api';
import { Ubication } from '../../api';
import { ButtonModule } from 'primeng/button';
import { ScheduleViewComponent } from 'src/app/components/schedule-view/schedule-view.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { NgClass } from '@angular/common';
import { UbicationService } from '../../pages/services/ubication.service';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UbicationFormComponent } from './ubication-form.component';
import { UbicationCardComponent } from './ubication-card/ubication-card.component';

@Component({
    selector: 'app-ubication-form-modal',
    standalone: true,
    imports: [
        DialogModule,
        PickListModule,
        OverlayPanelModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        InputTextareaModule,
        ScheduleViewComponent,
        UbicationFormComponent,
        UbicationCardComponent,
        ReactiveFormsModule,
        NgClass,
    ],
    template: `
        <p-dialog
            [(visible)]="visible"
            [modal]="true"
            maskStyle="backdrop-filter: blur(2px);"
            [style]="{ width: '80vw', boxShadow: 'none' }"
            [draggable]="false"
            [resizable]="false"
            header="Informacion detallada"
            (onHide)="onClose()"
        >
            <ng-template pTemplate="headless">
                <div class="grid h-full">
                    <section
                        class="bg-white h-full mr-3 col md:col-9 border-round"
                    >
                        <h2 class="p-4">{{ getTitle() }}</h2>
                        <app-ubication-form (onSubmit)="submit($event)" (onFormChange)="setUbicationFormValueToCard($event)" [ubication]="ubication" />
                    </section>

                    <section class="bg-white h-full col p-0  border-round">
                        <div class="w-full h-full">
                            <app-ubication-card  [ubicationFormValue]="ubicationCardValue"/>
                        </div>
                    </section>
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: `
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationFormModalComponent implements Modal {

    @Input({ required: true }) visible: boolean = false;
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();
    @Input() ubication: Ubication | null | undefined;
    @Output() ubicationChange = new EventEmitter();
    @Output() onSubmit = new EventEmitter();

    ubicationCardValue: any

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
     * Funcion para settear las horas de la ubicacion
     * @param event string[] con las horas de la ubicacion
     */
    setUbicationFormValueToCard(event:any){     
        const {ubication, manager, becas, description, schedule, photo, typeSchedule} = event
        this.ubicationCardValue = {
            ubication,
            manager,
            becas,
            description,
            schedule,
            photo,
            typeSchedule
        }
    }
    
    /**
     * Funcion para enviar el formulario
     */
    submit(event:any){
        this.onSubmit.emit(event)
        this.onClose() 
    }
}
