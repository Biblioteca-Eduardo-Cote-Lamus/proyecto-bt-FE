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
                @for (day of [ days[0], days[5] ]; track $index) {
                    <div class="bg-gray-100 border-round py-4 mb-3">
                        <div class="flex align-items-center gap-3 mb-3 px-3 ">
                            <p-inputSwitch [(ngModel)]="day.available" ></p-inputSwitch>
                            <span class="inline-block"> {{ $index == 0 ? 'Lunes a Viernes' : 'Sabado' }} </span>
                        </div>
                        @if (day.available) {
                            <div class="p-fluid  px-3 flex flex-column justify-content-center align-items-center">
                                @for (hour of day.hours; track $index) {
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
                                        @if($index > 0){
                                            <p-button icon="pi pi-minus" [rounded]="true" [text]="true" severity="danger "></p-button>
                                        }
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
                                @if($index > 0){
                                    <p-button icon="pi pi-minus" [rounded]="true" [text]="true" severity="danger "></p-button>
                                }
    
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
                            <div class="p-fluid mb-3 px-3 flex flex-column justify-content-center align-items-center">
                                @for (hour of day.hours; track $index) {
                                    <div class=" mb-4 flex  justify-content-center align-items-center gap-3">
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

                                        <span>Becas asignados</span>

                                        <p-inputNumber 
                                            [styleClass]="'w-6rem text-center'" 
                                            [ngClass]="{'ng-dirty ng-invalid': !hour.valid}" 
                                            [min]="1" 
                                            [(ngModel)]="hour.becas"/>
                                        
                                            @if($index > 0){
                                            <p-button icon="pi pi-minus" [rounded]="true" [text]="true" severity="danger "></p-button>
                                        }

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
    @Output() daysChange = new EventEmitter()

    // Variable para controlar los dias del horario
    days: any = []
    typesSchedule: any = []
    selectedTypeSchedule: any = null

    ngOnInit(): void { 
        this.initTypesSchedule()
        this.initDaysValues()
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
                        start: "6:00 AM",
                        end: "7:00 AM",
                        valid: true,
                        becas : 0
                    }
                ]
            }
        })
        // emitimos los dias para que el padre pueda obtener los valores
        this.daysChange.emit([...this.days])
    }

    /**
     * Inicializa los tipos de horario
     */
    private initTypesSchedule(){
        this.typesSchedule = [
            {
                name: 'Unificado (excluye sabado)',
                key: 'unifiedWithoutSaturday'
            },
            {
                name: 'Unificado (incluye sabado)',
                key: 'unifiedIncludingSaturday'
            },
            {
                name: 'Personalizado',
                key: 'custom'
            }
        ]
        this.selectedTypeSchedule = this.typesSchedule[0]
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
        this.daysChange.emit([...this.days])
    }

    /**
     * retorna las horas disponibles
     */
    getAvailableHours(){
        return [
            '6:00 AM',
            '7:00 AM',
            '8:00 AM',
            '9:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '1:00 PM',
            '2:00 PM',
            '3:00 PM',
            '4:00 PM',
            '5:00 PM',
            '6:00 PM',
            '7:00 PM',
            '8:00 PM',
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

            const startNumber = start[1].includes('PM') ? parseInt(start[0]) + 12 : parseInt(start[0])
            const endNumber = end[1].includes('PM') ? parseInt(end[0]) + 12 : parseInt(end[0])

            hour.valid = startNumber < endNumber
        })

        // emitimos los dias para que el padre pueda obtener los valores
        this.daysChange.emit([...this.days])
    }

    /**
     * Detecta el cambio de tipo de horario y reinicia los valores de los dias
     */
    changeTypeSchedule(){
        this.initDaysValues()
        this.daysChange.emit([...this.days])
    }

    /**
     *  Cambia el valor de los becas disponibles cada que se cambia el valor de un input number
     * @param event evento de cambio de becas apatir del input number
     */
    checkBecas(event: any){
        this.becasAvailable -= parseInt(event.value) 
    }

}
