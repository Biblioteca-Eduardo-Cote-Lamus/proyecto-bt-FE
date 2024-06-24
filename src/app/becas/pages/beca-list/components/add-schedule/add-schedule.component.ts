import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ModalSchedule } from '../../api';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { transformSchedule } from '../../utils';

export enum Actions{
    ADD = 'Agregar', // agregar y hace la petición a la API
    EDIT = 'Editar', // editar y hace la petición a la API
    ADD_AND_EMIT = 'Agregar y notificar', // agregar y emite el evento con la data 
    EDIT_AND_EMIT = 'Editar y notificar', // editar y emite el evento con la data
    CREATE = 'Crear', // crea el horario y hace la petición a la API
    CREATE_AND_EMIT = 'Crear y notificar' // crea el horario y emite el evento con la data
}

export interface onChangeSchedule { 
    beca: BecaTrabajoByUbication,
    schedule: Array<AddSchedule>
    action: Actions
}

export interface Hours {
    start: string,
    end: string
    valid: boolean
}
export interface AddSchedule {
    day: string,
    hours: Array<Hours>
}

@Component({
    selector: 'app-add-schedule',
    standalone: true,
    imports: [
        CommonModule,
        DropdownModule,
        ButtonModule,
        TooltipModule,
        FormsModule,
    ],
    template: `
    
        <div>

            <div class="p-fluid mb-4">
                <label for="beca" class="inline-block mb-2">Seleccione un beca</label>
                <p-dropdown 
                    [options]="becas"
                    optionLabel="fullName" 
                    inputId="beca"
                    placeholder="Beca"
                    [(ngModel)]="beca" />
            </div>

            <!-- dias de la semana -->
            <div class="mb-4">
                <label class="block mb-2"> Para el día </label>
                <div class="flex gap-3">
                    @for (day of days; track $index) {
                        <p-button 
                            [label]="day" 
                            [pTooltip]="getDayName(day)" 
                            tooltipPosition="top"
                            (onClick)="selectedDay = getDayName(day)"
                            severity="{{ getDayName(day) === selectedDay ? 'secondary' : ''}}" />
                    }
                </div>
            </div>

            <!-- horas -->
            <div class="mb-4">
                <label class="block mb-3"> 
                    Horario
                    <span style="font-size: .8rem;">({{selectedDay}})</span>
                </label>
                <div class="flex flex-column gap-2 mb-3">
                    @for (item of findScheduleByDay(selectedDay).hours; track $index) {
                        <div class="flex gap-2">
                            <p-dropdown 
                                [options]="getAvailableHours()" 
                                [(ngModel)]="item.start"
                                [styleClass]="'w-13rem'" />
                            <p-dropdown 
                                [options]="getAvailableHours()" 
                                [(ngModel)]="item.end"
                                [styleClass]="'w-13rem'" />
                            <p-button 
                                icon="pi pi-minus" 
                                [rounded]="true" 
                                [text]="true" 
                                severity="danger "
                                (onClick)="removeHour(item)" />
                        </div>
                    } @empty {
                        <span>No hay horarios</span>
                    }
                </div>
                <div class="w-full p-fluid">
                    <p-button  
                        icon="pi pi-plus" 
                        [outlined]="true" 
                        severity="secondary" 
                        [styleClass]="'w-full border-gray-100 bg-gray-200 hover:bg-gray-300'"
                        pTooltip="Agregar hora"
                        tooltipPosition="top" 
                        (onClick)="addNewHourToSchedule()">
                    </p-button>
                </div>
            </div>

            <!-- acciones -->

            <div class="flex gap-2">
                <div class="ml-auto">
                    <p-button 
                        label="Guardar" 
                        [styleClass]="'mr-3'"
                        icon="pi pi-send"
                        iconPos="right"
                        (onClick)="sendSchedule()" />
                    <p-button 
                        label="Cancelar" 
                        severity="secondary"
                        (onClick)="cancel()" />
                </div>
            </div>


        </div>
    
    
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddScheduleComponent implements OnInit, ModalSchedule {
    
    /**
     * Emite un evento cuando se cancela la operación
     */
    @Output() onCancel: EventEmitter<boolean> = new EventEmitter();

    /**
     * Emite un evento  si el action es agregar o editar y emitir
     */
    @Output() onChange: EventEmitter<onChangeSchedule> = new EventEmitter();

    /**
     * Horas cubiertas por el beca
     */
    @Input() coveredHours: any

    /**
     * Beca seleccionada
     */
    @Input() beca:BecaTrabajoByUbication | undefined

    /**
     * Accion a realizar: Agregar o editar, por defecto es agregar
     */
    @Input() action: Actions = Actions.ADD

    /**
     * Lista de becas
     */
    becas: BecaTrabajoByUbication[] = []

    /**
     * Dia seleccionado, por defecto es Lunes
     */
    selectedDay = 'Lunes';

    /**
     * Controla el horario de la beca
     */
    schedule: AddSchedule[]  = []
    
    ngOnInit(): void { 
        
        if (!this.coveredHours) {
            this.loadInitialSchedule()   
        }

    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        const { coveredHours, beca } = changes

        
        if(!beca || !coveredHours){
            this.loadInitialSchedule()
        }

        if(beca && beca.currentValue){
            this.becas = [...this.becas, beca.currentValue ]
        }

        if(coveredHours && coveredHours.currentValue){
            this.schedule = transformSchedule(coveredHours.currentValue)  
        }
        
    }

    /**
     * Carga el horario inicial si no se ha enviado un beca y su horario
     * @returns
    */
    loadInitialSchedule(){
        this.schedule = this.days.map(day => {
            return {
                day: this.getDayName(day),
                hours: [
                    {
                        start: this.getAvailableHours()[0],
                        end: this.getAvailableHours()[1],
                        valid: true
                    }
                ]
            }
        })
    }

    findScheduleByDay(day: string){
        return this.schedule.find(schedule => schedule.day.toLowerCase() === day.toLowerCase())
    }

    /**
     * Iniciales de los dias de la semana
     */
    get days(){
        return [
            'L',
            'M',
            'Mi',
            'J',
            'V',
            'S',
        ]
    }

    /**
     * retorna las horas disponibles
     */
    getAvailableHours(){
        return [
            '06:00 AM',
            '07:00 AM',
            '08:00 AM',
            '09:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '01:00 PM',
            '02:00 PM',
            '03:00 PM',
            '04:00 PM',
            '05:00 PM',
            '06:00 PM',
            '07:00 PM',
            '08:00 PM',
        ]
    }

    /**
     * Emite un evento cuando se cancela la operación
     */
    cancel () {
        this.onCancel.emit(false)
    }

    /**
     * Determina el nombre del dia  a partir de la letra inicial
     * @param initialDayLetter letra inicial del dia
     * @returns Nombre del dia
     */
    getDayName(initialDayLetter: string){
        switch (initialDayLetter) {
            case 'L':
                return 'Lunes';
            case 'M':
                return 'Martes';
            case 'Mi':
                return 'Miercoles';
            case 'J':
                return 'Jueves';
            case 'V':
                return 'Viernes';
            case 'S':
                return 'Sabado';
            default:
                return '';
        }
    }

    /**
     * Agrega una nueva hora al horario
     */
    addNewHourToSchedule(){

        this.schedule = this.schedule.map(schedule => {
            if(schedule.day.toLowerCase() === this.selectedDay.toLowerCase()){
                if(schedule.hours.length > 0){
                    const nextHours = this.nextHours(schedule.hours[schedule.hours.length - 1].end)
                    schedule.hours.push({
                        start: nextHours[0],
                        end: nextHours[1],
                        valid: true
                    })
                } 

                if(schedule.hours.length === 0){
                    schedule.hours.push({
                        start: this.getAvailableHours()[0],
                        end: this.getAvailableHours()[1],
                        valid: true
                    })
                }
            }
            return schedule
        })
    }

    /**
     * Obtiene las siguientes horas disponibles a partir de la hora de finalizacion de la ultima hora
     * @param end hora de finalizacion de la ultima hora
     */
    private nextHours(end: string){
    
        // obtengo las horas disponibles otra vez
        const availableHours = this.getAvailableHours()

        // obtengo la siguiente hora disponible a partir de la hora de finalizacion de la ultima hora
        const nextHourIndex = availableHours.indexOf(end) 

        return [ this.getAvailableHours()[nextHourIndex], this.getAvailableHours()[nextHourIndex + 1] ]
    }

    /**
     * Funcion para eliminar una hora del horario
     * @param hour hora a eliminar
     */
    removeHour(hour: Hours){
        this.schedule = this.schedule.map(schedule => {
            if(schedule.day.toLowerCase() === this.selectedDay.toLowerCase()){
                schedule.hours = schedule.hours.filter(item => item.start !== hour.start)
            }
            return schedule
        })
    }

    /**
     * Funcion para enviar el horario a la API y seleccionar el beca
     */
    sendSchedule(){
        const data: onChangeSchedule = {
            beca: {...this.beca},
            schedule: [...this.schedule],
            action: this.action
        }  
        
        this.takeAction(data)
    }

    /**
     * Funcion para realizar la accion seleccionada
     * @param data Información a procesar
     * @returns 
     */
    private takeAction( data: onChangeSchedule){

        // hacer la petición a la API
        if(this.action === Actions.CREATE_AND_EMIT){
            // emitir el evento con la data
            this.onChange.emit({...data})
            return 
        }

        if(this.action === Actions.CREATE ) {
            // hacer la petición a la API
            return
        }

        if(this.action === Actions.ADD || this.action === Actions.EDIT){
            const url = this.action === Actions.ADD ? 'add' : 'edit'
            return
        }

        if(this.action === Actions.ADD_AND_EMIT || this.action === Actions.EDIT_AND_EMIT){
            // emitir el evento con la data
            this.onChange.emit({...data})
            return
        }
    }

}
