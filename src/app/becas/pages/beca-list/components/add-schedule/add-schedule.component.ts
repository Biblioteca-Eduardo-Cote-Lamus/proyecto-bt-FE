import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ModalSchedule } from '../../api';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';

interface Hours {
    start: string,
    end: string

}
interface AddSchedule {
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
        FormsModule
    ],
    template: `
    
        <div>

            <div class="p-fluid mb-4">
                <label for="beca" class="inline-block mb-2">Seleccione un beca</label>
                <p-dropdown 
                    [options]="[{name: 'Angel'}]"
                    optionLabel="name" 
                    inputId="beca"
                    placeholder="Beca" />
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
     * Dia seleccionado, por defecto es Lunes
     */
    selectedDay = 'Lunes';

    schedule: AddSchedule[]  = []
    
    ngOnInit(): void { 
        this.loadInitialSchedule()
    }

    loadInitialSchedule(){
        this.schedule = this.days.map(day => {
            return {
                day: this.getDayName(day),
                hours: [
                    {
                        start: this.getAvailableHours()[0],
                        end: this.getAvailableHours()[1]
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
                        end: nextHours[1]
                    })
                } 

                if(schedule.hours.length === 0){
                    schedule.hours.push({
                        start: this.getAvailableHours()[0],
                        end: this.getAvailableHours()[1]
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

    removeHour(hour: Hours){
        this.schedule = this.schedule.map(schedule => {
            if(schedule.day.toLowerCase() === this.selectedDay.toLowerCase()){
                schedule.hours = schedule.hours.filter(item => item.start !== hour.start)
            }
            return schedule
        })
    }

    sendSchedule(){
        console.log(this.schedule);     
    }

}
