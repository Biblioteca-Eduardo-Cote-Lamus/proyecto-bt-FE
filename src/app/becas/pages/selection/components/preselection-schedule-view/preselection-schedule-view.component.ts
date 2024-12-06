import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

export interface InforPerDay {
    day: string[];
    coveredHours: string[][];
    hoursToPerform: string[][];
}


export interface BecaSchedule {
    day: string[];
    hours: string[];
}

@Component({
    selector: 'app-preselection-schedule-view',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        TooltipModule
    ],
    template: `
        <p-table
            [value]="colTimes"
            [style]="{ width: '100%' }"
            [columns]="colDays"
            [scrollable]="true"
            scrollHeight="500px"
            styleClass="p-datatable-gridlines p-datatable-striped"
        >
            <ng-template pTemplate="emptymessage">
                No hay horario asignado aún
            </ng-template>
            <ng-template pTemplate="header" let-columns>
                <tr>
                    <th>Hora</th>
                    @for (col of columns; track $index+col) {
                      <th>{{ col }}</th>
                    }
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-time let-columns="columns" let-i="rowIndex">
                <tr>
                    <td>{{ time }}</td>

                    @if(isInforPerDay(schedule)){
                        @for (day of columns; track $index) {
                            <td>
                                @if (schedule.day.includes(day.toLowerCase())) {
                                    <div class="flex justify-content-center gap-2">

                                         @if (isInBothHour( day, time) ) {
                                            <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1" pTooltip="Ubicacion" tooltipPosition="top">
                                                <i class="pi pi-check"></i>
                                            </span>
                                            <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1" pTooltip="Beca" tooltipPosition="top">
                                                <i class="pi pi-check"></i>
                                            </span>
                                        } @else if(isInPerformHour(day,time)){
                                            <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1" pTooltip="Ubicacion" tooltipPosition="top">
                                                <i class="pi pi-check"></i>
                                            </span>
                                            <span class="time-card inline-block p-2 w-4rem border-round bg-red-400 text-white transition-transform transition-duration-150 hover:shadow-1" pTooltip="Beca" tooltipPosition="top">
                                                <i class="pi pi-times"></i>
                                            </span>
                                        }
                                        @else {.}
                                    </div>

                                } @else {
                                    .
                                }
                            </td>
                                
                        }
                    }

                    @else{
                        @for (day of columns; track $index) {
                            @if (schedule.day.includes(day.toLowerCase())) {
                                @if (schedule.hours[$index].includes(time)) {
                                    <td class="">
                                        <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1">
                                            <i class="pi pi-check"></i>
                                        </span>
                                    </td>
                                }
                                @else {
                                    <td>
                                        <div class="bg-yellow-500 text-white border-round p-2 w-8rem mx-auto">
                                            En clase
                                        </div>
                                    </td>
                                }
                                
                            } @else {
                                <td>
                                    <div class="bg-yellow-500 text-white border-round p-2 w-8rem mx-auto">
                                        En clase
                                    </div>
                                </td>
                            }
                        }
                    }
                   
                </tr>
            </ng-template>
        </p-table>
    
    `,
    styles: `
        tr,td,th {
            text-align: center
        }
        .time-card:hover{
            transform: scale(1.1),
        }
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionScheduleViewComponent implements OnInit {

    @Input({required: true}) schedule: BecaSchedule | InforPerDay;

    ngOnInit(): void {
        console.log(this.schedule);
        
    }

    get colDays() {
        return ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    }

    get colTimes() {
        return [
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
        ];
    }

    /**
     * Funcion para determinar si el objeto es de tipo InforPerDay
     * @param obj objeto a verificar    
     * @returns 
     */
    isInforPerDay(obj: any) {
        return 'coveredHours' in obj && 'hoursToPerform' in obj;
    }

    /**
     * Funcion para determinar si el horario es cubierto por la ubicacion y por el beca.
     * @param day dia de la semana
     * @param time horario a verificar. Ejemplo: 06:00-07:00 <- en ese formato
     * @returns True si el horario esta en la lista de horas de la ubicacion y en la del beca
     */
    isInBothHour(day: string, time:string){
        const indexHours = this.schedule.day.indexOf(day.toLowerCase());

        if ('coveredHours' in this.schedule) {
            return this.schedule.coveredHours[indexHours].includes(time) && this.schedule.hoursToPerform[indexHours].includes(time);
        }
        return false;
    }

    /**
     * Funcion para determinar si el horario es cubierto por la ubicacion.
     * @param day dia de la semana
     * @param time Horario a verificar. Ejemplo: 06:00-07:00 <- en ese formato
     * @returns True si el horario esta en la lista de horas de la ubicacion
     */
    isInPerformHour(day: string, time:string){
        const indexHours = this.schedule.day.indexOf(day.toLowerCase());

        if ('hoursToPerform' in this.schedule) { 
            return this.schedule.hoursToPerform[indexHours].includes(time);
        }
        return false;
    }


}
