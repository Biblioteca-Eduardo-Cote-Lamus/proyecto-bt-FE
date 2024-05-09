import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';

import { TYPES_SCHEDULE, TYPES_SCHEDULE_KEYS } from "../const/ubication-schedule.const";
import { UbicationSchedule } from '../../../api';


@Component({
    selector: 'app-ubication-schedule',
    standalone: true,
    imports: [
        CommonModule,
        InputSwitchModule,
        CheckboxModule,
        AccordionModule,
        DropdownModule,
        ButtonModule,
        RadioButtonModule,
        InputNumberModule,
        MultiSelectModule,
        FormsModule,

    ],
    template: `
    
        <section>

            <!-- tipo de horario, lo haremos con radio button  -->
            <div class=" mb-4">
                <div class="flex justify-content-between align-items-center py-3">
                    <span class="inline-block mb-3 text-xl">Tipo de horario</span>
                    <span>Becas disponibles ({{ becasAvailable }})</span>
                </div>
                
                <div class="flex  gap-3">
                    @for (schedule of typesSchedule; track $index) {
                        <div class="flex align-items-center">
                            <p-radioButton 
                                name="typeSchedule" 
                                [value]="schedule" 
                                [(ngModel)]="selectedTypeSchedule" 
                                [inputId]="schedule.key" 
                                (onClick)="changeTypeSchedule()"
                                />
                            <label [for]="schedule.key" class="ml-2">
                                {{schedule.name}}
                            </label>
                        </div>
                    }
                </div>

            </div>

            <!-- unificado  excluyendo el sabado -->
            @if(selectedTypeSchedule ===  typesSchedule[0]){
                @for (day of getSchedules(); track $index) {
                    <div class="bg-gray-100 border-round py-4 mb-3">
                        <div class="flex align-items-center gap-3 mb-3 px-3 ">
                            <p-inputSwitch [(ngModel)]="day.available" ></p-inputSwitch>
                            <span class="inline-block"> {{ $index == 0 ? 'Lunes a Viernes' : 'Sabado' }} </span>
                        </div>
                        @if (day.available) {
                            <div class="p-fluid  px-3 flex flex-column justify-content-center align-items-center">
                                @for (hour of day.hours; track $index) {
                                    <div class="flex">
                                        <div class=" mb-4 flex  justify-content-center align-items-center gap-3">
                                            <p-dropdown 
                                                [options]="getAvailableHours()" 
                                                [(ngModel)]="hour.start" 
                                                placeholder="Hora inicio" 
                                                (onChange)="checkHour(day)"
                                                [ngClass]="{'ng-dirty ng-invalid': !hour.valid}"/>
                                            
                                            <span> a </span>
                                            
                                            <p-dropdown 
                                                [options]="getAvailableHours()" 
                                                [(ngModel)]="hour.end" 
                                                placeholder="Hora inicio"
                                                (onChange)="checkHour(day)" 
                                                [ngClass]="{'ng-dirty ng-invalid': !hour.valid}"/>
                
                                            <span class="text-center">becas asignados</span>
                                            <p-inputNumber 
                                                [styleClass]="'w-6rem text-center'" 
                                                [ngClass]="{'ng-dirty ng-invalid': !hour.valid}" 
                                                [min]="1" 
                                                (onInput)="checkBecas($event)"
                                                [(ngModel)]="hour.becas"/>
                                        </div>
                                        <p-button 
                                            icon="pi pi-minus" 
                                            [rounded]="true" [text]="true" 
                                            severity="danger" 
                                            [ngClass]="{'opacity-0': $index == 0}" 
                                            (onClick)="removeHour(day, hour)" />
                                    </div>
                                }
                                <div class="w-full p-fluid">
                                    <p-button 
                                        (onClick)="addHour(day)" 
                                        icon="pi pi-plus" 
                                        [outlined]="true" 
                                        severity="secondary" 
                                        [styleClass]="'w-full border-gray-100 bg-gray-200 hover:bg-gray-300'" 
                                        [disabled]="becasAvailable === 0" >
                                    </p-button>
                                </div>
                            </div>
                        }
                    </div>
                }
            }

            <!-- unificado  incluyebdo sabado -->
            @if (selectedTypeSchedule === typesSchedule[1] ) {
                <div class="bg-gray-100 border-round py-4 mb-3">
                    <span class="inline-block px-4 mb-3"> Lunes a Sabado </span>
                    <div class="p-fluid  px-3 flex flex-column justify-content-center align-items-center">
                        @for (hour of days[0].hours; track $index) {
                            <div class="flex">
                                <div class=" mb-4 flex  justify-content-center align-items-center gap-3">
                                    <p-dropdown 
                                        [options]="getAvailableHours()" 
                                        [(ngModel)]="days[0].start" 
                                        placeholder="Hora inicio" 
                                        (onChange)="checkHour(days[0])"
                                        [ngClass]="{'ng-invalid ng-dirty': !days[0].valid}"/>
                                    
                                    <span> a </span>
                                    
                                    <p-dropdown 
                                        [options]="getAvailableHours()" 
                                        [(ngModel)]="days[0].end" 
                                        placeholder="Hora inicio"
                                        (onChange)="checkHour(days[0])" 
                                        [ngClass]="{'ng-invalid ng-dirty': !days[0].valid}"/>
        
                                    <span class="text-center">Becas asignados</span>
    
                                    <p-inputNumber 
                                            [styleClass]="'w-6rem text-center'" 
                                            [ngClass]="{'ng-dirty ng-invalid': !hour.valid}" 
                                            [min]="1" 
                                            [(ngModel)]="hour.becas"/>
        
                                </div>
                                <p-button 
                                    icon="pi pi-minus" 
                                    [rounded]="true" [text]="true" 
                                    severity="danger" 
                                    [ngClass]="{'opacity-0': $index == 0}" 
                                    (onClick)="removeHour(days[0], hour)" />
                            </div>
                            
                                        
                        }
                        <div class="w-full p-fluid">
                            <p-button 
                                (onClick)="addHour(days[0])" 
                                icon="pi pi-plus" 
                                [outlined]="true" 
                                severity="secondary" 
                                [styleClass]="'w-full border-gray-100 bg-gray-200 hover:bg-gray-300'"
                                [disabled]="becasAvailable === 0"  >
                            </p-button>
                        </div>
                    </div>
                </div>
            }


            <!-- personalizado -->
            @if (selectedTypeSchedule === typesSchedule[2]) {
                @for (day of days; track $index) {
                    <div class="bg-gray-100 border-round p-2 mb-3">
                        <!-- encabezado -->
                        <div class="flex align-items-center gap-3 mb-3 p-3">
                            <p-inputSwitch [(ngModel)]="day.available" ></p-inputSwitch>
                            <span> {{day.name}} </span>
                        </div>
                        <!-- horas -->
                        @if(day.available){
                            <div class=" mb-3 px-3 flex flex-column justify-content-center align-items-center">
                                @for (hour of day.hours; track $index) {
                                    <div class="flex ">
                                        <div class=" mb-4 flex  justify-content-center align-items-center gap-3 relative">
                                            <p-dropdown 
                                                [options]="getAvailableHours()" 
                                                [(ngModel)]="hour.start" 
                                                placeholder="Hora inicio" 
                                                (onChange)="checkHour(day)"
                                                [ngClass]="{'ng-invalid ng-dirty': !hour.valid}"/>
                                            
                                            <span> a </span>
                                            
                                            <p-dropdown 
                                                [options]="getAvailableHours()" 
                                                [(ngModel)]="hour.end" 
                                                placeholder="Hora inicio"
                                                (onChange)="checkHour(day)" 
                                                [ngClass]="{'ng-invalid ng-dirty': !hour.valid}"/>
    
                                            <span>Asignar</span>
                                            
                                            <p-multiSelect 
                                                [options]="becas" 
                                                [(ngModel)]="hour.becas" 
                                                optionLabel="name"
                                                placeholder="Seleccionar beca"
                                                
                                                />
    
                                        </div>

                                        <p-button 
                                            icon="pi pi-minus" 
                                            [rounded]="true" [text]="true" 
                                            severity="danger" 
                                            [ngClass]="{'opacity-0': $index == 0}" 
                                            (onClick)="removeHour(day, hour)" >
                                        </p-button>
                                        
                                    </div>
                                }
                                <div class="w-full p-fluid">
                                    <p-button 
                                        (onClick)="addHour(day)" 
                                        icon="pi pi-plus" 
                                        [outlined]="true" 
                                        severity="secondary" 
                                        [styleClass]="'w-full border-gray-100 bg-gray-200 hover:bg-gray-300'"
                                        [disabled]="becasAvailable === 0"  >
                                    </p-button>
                                </div>
                            </div>
                        }
                    </div>
                }  
            }
        </section>
    
    `,
    styles: `
        .horas-container{
            width: 70%;
            margin-right: auto;
            margin-left: auto;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationScheduleComponent implements OnInit {

    @Input() becasAvailable = 0
    @Input() schedule: UbicationSchedule = null
    @Output() daysChange = new EventEmitter()

    // Variable para controlar los dias del horario
    days: any = []
    // Variable para controlar los tipos de horario
    typesSchedule: any = []
    // variable para controlar el tipo de horario seleccionado
    selectedTypeSchedule: any = null

    // Variable para controlar las becas disponibles en caso de que se seleccione horario personalizado
    becas : any = []

    ngOnInit(): void { 

        if(this.schedule){
            this.setScheduleValues()
            // emitimos los dias para que el padre pueda obtener los valores
            this.daysChange.emit({ scheduleType: this.selectedTypeSchedule, schedule: [...this.days]})
            return
        }
        this.initTypesSchedule()
        this.initBecas()
        this.initDaysValues()

        // emitimos los dias para que el padre pueda obtener los valores
        this.daysChange.emit({ scheduleType: this.selectedTypeSchedule, schedule: [...this.days]})
    }

    /**
     * Inicializa los valores del horario en caso de qeu se envie uno, es decir, se esta editando
     */
    private setScheduleValues(){
        
        if(this.schedule.scheduleType === TYPES_SCHEDULE_KEYS.unifiedWithoutSaturday) {
            // solo se debe iniciarlizar el valor del lunes y sabado. El sabado solo si fue seleccionado   
            this.days = this.schedule.schedule.map( horario => ({
                name: horario.days[0],
                available: true,
                hours: horario.hours
            }));

            if(this.days.length === 1) {
                this.days.push({
                    name: 'Sabado',
                    available: false,
                    hours: {
                        start: '06:00 AM',
                        end: '07:00 AM',
                        valid: true,
                        becas: 0
                    }
                })
            }
            
        }

        if(this.schedule.scheduleType === TYPES_SCHEDULE_KEYS.unifiedIncludingSaturday ){
            this.days = this.schedule.schedule.map( horario => ({
                name: horario.days[0],
                available: true,
                hours: horario.hours
            }));
        }

        if(this.schedule.scheduleType === TYPES_SCHEDULE_KEYS.custom){
            // si es custom, se inicializa el valor de los dias y despues se maneja el valor de las becas
            this.initDaysValues()
            this.days = this.days.map( day => {
                const horario = this.schedule.schedule.find( h => h.days[0].toLowerCase() === day.name.toLowerCase())
                if (horario){
                    return {
                        ...day,
                        available: true,
                        hours: horario.hours
                    }
                }
                return day
            })            
        }

        this.initTypesSchedule()
        this.initBecas()
        this.selectedTypeSchedule = TYPES_SCHEDULE.find( t => t.key === this.schedule.scheduleType)

    }

    getSchedules(){
        if(this.schedule){
            return [...this.days]
        }
        return [this.days[0], this.days[5]]
    }


    /**
     * Devuelve el nombre del dia de la semana segun el indice
     * @param index 0-6, donde 0 lunes, 1 martes, 2 miercoles, 3 jueves, 4 viernes, 5 sabado, 6 domingo
     */
    private getDays(index: number){
        switch(index){
            case 0:
                return "Lunes"
            case 1:
                return "Martes"
            case 2:
                return "Miercoles"
            case 3:
                return "Jueves"
            case 4:
                return "Viernes"
            case 5:
                return "Sabado"
            default:
                return ""
        }
    }

    /**
     * Inicializa los valores de los dias por defecto
     */
    private initDaysValues(){
        // const length = this.selectedTypeSchedule === this.typesSchedule[0] ? 5 : 6;
        const length = 6;

        this.days = Array.from({length}, (_, i) => {
            return {
                name: this.getDays(i),
                available: i == 0 ? true : false,
                hours: [
                    {
                        start: "06:00 AM",
                        end: "07:00 AM",
                        valid: true,
                        becas : 0
                    }
                ]
            }
        })
        
    }

    /**
     * Inicializa los tipos de horario
     */
    private initTypesSchedule(){
        this.typesSchedule = [
            ...TYPES_SCHEDULE
        ]
        this.selectedTypeSchedule = this.typesSchedule[0]
    }

    /**
     * Inicializa las becas disponibles a partir del input becasAvailable
     */
    private initBecas(){
        this.becas = Array.from({length: this.becasAvailable}, (_, i) => {
            return { name: `Beca ${i + 1}` }
        })
    }

    /**
     * Agrega una hora al dia
     * @param day dia al que se le agregara la hora
     */
    addHour(day:any){
        
        // obtengo la ultima hora agregada
        const lastHour = day.hours[day.hours.length - 1]

        // obtengo las horas disponibles otra vez
        const availableHours = this.getAvailableHours()

        // obtengo la siguiente hora disponible a partir de la hora de finalizacion de la ultima hora
        const nextHourIndex = availableHours.indexOf(lastHour.end) 

        // si la hora de finalizacion son las 7PM o 8PM no se puede agregar mas horas
        if(nextHourIndex >= availableHours.length - 2 ){
            return
        }

        // agrego la siguiente hora disponible
        day.hours.push({
            start: availableHours[nextHourIndex],
            end: availableHours[nextHourIndex + 1],
            valid: true
        })

        // emitimos los dias para que el padre pueda obtener los valores
        this.daysChange.emit({ scheduleType: this.selectedTypeSchedule, schedule: [...this.days]})
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
     * Verifica si las horas de un dia son correctas
     * @param day dia al que se verificara si las horas estan correctas
     */
    checkHour(day: any){
        // verificamos que las horas esten correctas, la hora de inicio es menor a la final y la hora de fin es mayor a la de inicio
        day.hours.forEach((hour: any) => {
            const start =hour.start.split(':')
            const end =hour.end.split(':')

            let startNumber = 0
            let endNumber = 0

            if(start[0].includes('12'))
                startNumber = parseInt(start[0])
            else if(start[1].includes('PM'))
                startNumber = parseInt(start[0]) + 12
            else
                startNumber = parseInt(start[0])

            if(end[0].includes('12'))
                endNumber = parseInt(end[0])
            else if(end[1].includes('PM'))
                endNumber = parseInt(end[0]) + 12
            else
                endNumber = parseInt(end[0])
            
            hour.valid = startNumber < endNumber
        })

        // emitimos los dias para que el padre pueda obtener los valores
        this.daysChange.emit({ scheduleType: this.selectedTypeSchedule, schedule: [...this.days]})
    }

    /**
     * Detecta el cambio de tipo de horario y reinicia los valores de los dias
     */
    changeTypeSchedule(){
        this.initDaysValues()
        this.daysChange.emit({ scheduleType: this.selectedTypeSchedule, schedule: [...this.days]})
    }

    /**
     *  Cambia el valor de los becas disponibles cada que se cambia el valor de un input number
     * @param event evento de cambio de becas apatir del input number
     */
    checkBecas(event: any){
        if(event.value === null) return 

        this.becasAvailable -= parseInt(event.value) 
    }

    /**
     * Elimina una hora de un dia
     * @param day dia al que se le eliminara la hora
     * @param hour hora que se eliminara
     */    
    removeHour(day: any, hour: any){
        // si solo hay una hora no se puede eliminar
        if(day.hours.length === 1){ return }

        // eliminamos la hora en caso contrario
        day.hours = day.hours.filter((h: any) => h !== hour)

        // emitiendo los dias para que el padre pueda obtener los valores
        this.daysChange.emit([...this.days])
    }

}
