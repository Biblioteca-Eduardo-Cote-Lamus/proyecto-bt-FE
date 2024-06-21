import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, type OnInit } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ModalSchedule } from '../../api';

@Component({
    selector: 'app-extra-time',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        CalendarModule,
        InputTextareaModule,
        FloatLabelModule
    ],
    template: `
    
        <div class="py-3">
            <form action="">

                <div class="p-fluid mb-4">
                    <p-floatLabel>
                        <p-dropdown 
                            [options]="[{name: 'Angel'}]"
                            optionLabel="name" 
                            inputId="beca"
                            placeholder="Beca" />
                        <label for="beca">Seleccione un beca</label>
                    </p-floatLabel>
                </div>

                <div class="p-fluid mb-4">
                    <label for="ubication" class="inline-block mb-2">Seleccione una ubicación</label>
                    <p-dropdown 
                        [options]="[{name: 'Pasillo 1'}]"
                        optionLabel="name" 
                        inputId="ubication"
                        placeholder="Ubicación" />
                </div>

                <!-- dia -->
                <div class="p-fluid mb-4">
                    <label for="date" class="inline-block mb-1">Seleccione una fecha</label>
                    <p-calendar 
                        id="date" 
                        [showIcon]="true"
                        [minDate]="minDate" />
                </div>

                <!-- descripcion de la actividad -->
                <div class="p-fluid mb-4">
                    <label for="description" class="block mb-2">Descripción de la actividad</label>
                    <textarea id="description" pInputTextarea rows="5" placeholder="Ej. Apoyar en procesos tecnicos" [autoResize]="true"></textarea>
                </div>

                <!-- tiemp -->
                <div class="p-fluid mb-5">

                    <div class="mb-4">
                        <label for="start" class="inline-block mb-1">Hora de inicio</label>
                        <p-dropdown 
                            [options]="[{name: 'Pasillo 1'}]"
                            optionLabel="name" 
                            inputId="start"
                            placeholder="Ubicación" />
                    </div>

                    <div>
                        <label for="end" class="inline-block mb-1">Hora de salida</label>
                        <p-dropdown 
                            [options]="[{name: 'Pasillo 1'}]"
                            optionLabel="name" 
                            inputId="end"
                            placeholder="Ubicación" />
                    </div>

                </div>

                <!-- acciones -->

                <div class="flex gap-2">
                    <div class="ml-auto">
                        <p-button 
                            label="Guardar" 
                            [styleClass]="'mr-3'"
                            icon="pi pi-send"
                            iconPos="right" />
                        <p-button 
                            label="Cancelar" 
                            severity="secondary"
                            (onClick)="cancel()" />
                    </div>
                </div>



            </form>



        </div>
    
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtraTimeComponent implements OnInit, ModalSchedule {

    /**
     * Emite un evento cuando se cancela la operación
     */
    @Output() onCancel = new EventEmitter<boolean>();

    ngOnInit(): void { }

    /**
     * Obtiene la fecha minima para el calendario
     */
    get minDate(){
        return new Date();
    }

    /**
     * Cancela la operación
     */
    cancel(){
        this.onCancel.emit(false);
    }

}
