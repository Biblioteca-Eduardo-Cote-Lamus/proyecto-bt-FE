import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Input, OnChanges, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ScheduleService } from './schedule.service';
import { TYPES_SCHEDULE_KEYS } from '../../becas/pages/ubication/components/ubication-form/const/ubication-schedule.const'

@Component({
    selector: 'app-schedule-view',
    standalone: true,
    imports: [TableModule, JsonPipe],
    template: `
        <p-table
            [value]="colTimes"
            [style]="{ width: '100%' }"
            [columns]="[
                'Lunes',
                'Martes',
                'Miercoles',
                'Jueves',
                'Viernes',
                'Sabado'
            ]"
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
            <ng-template pTemplate="body" let-time let-columns="columns">
                <tr>
                    <td>{{ time }}</td>
                    @for (day of columns; track $i) { 
                        @if(isUnficatedSchedule ){
                            @if(schedule()[0].days.includes(day.toLowerCase()) && schedule()[0].hours.includes(time)){
                                <td class="">
                                    <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1">
                                        <i class="pi pi-check"></i>
                                </span>
                            } @else if (schedule()[1].days.includes(day.toLowerCase()) && schedule()[1].hours.includes(time)){
                                <td class="">
                                    <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1">
                                        <i class="pi pi-check"></i>
                                </span>
                            } @else {
                                <td>.</td>
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
export class ScheduleViewComponent implements OnInit{
    
    schedule = computed(() => {
        if(this.scheduleService.scheduleFormat === null ) return []
        if(!this.scheduleService.scheduleFormat) return []

        return this.scheduleService.scheduleFormat.schedule.map(({days, hours}) => {
            return {
                days,
                hours: hours.map(({start, end}) => this.getHoursBetween(start, end)).flat()
            }
        }).flat()
    })

    constructor(private scheduleService: ScheduleService) {}

    ngOnInit(): void {
        console.log(this.schedule());
        
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
            '20:00-21:00',
            '21:00-22:00',
        ];
    }

    get isUnficatedSchedule(){
        return this.scheduleService.scheduleFormat?.scheduleType === TYPES_SCHEDULE_KEYS.unifiedIncludingSaturday || this.scheduleService.scheduleFormat?.scheduleType === TYPES_SCHEDULE_KEYS.unifiedWithoutSaturday 
    }
    
    private getHoursBetween(start: string, end: string) {
        
        // obtenemos los array donde 0 es la hora y 1 es el formato AM o PM y los trasformamos a numeros
        const startValues = start.split(' ')
        const endValues = end.split(' ')

        if (startValues[1] === 'PM') {
            // validamos que no sean las 12
            if(!startValues[0].includes('12')){
                startValues[0] = (parseInt(startValues[0]) + 12).toString().concat(':00')
            }
        }

        if (endValues[1] === 'PM') {
            // validamos que no sean las 12
            if(!endValues[0].includes('12')){
                endValues[0] = (parseInt(endValues[0]) + 12).toString().concat(':00')
            }
        }

        // encontramos los indeces y generamos el slice
        const startIndex = this.colTimes.findIndex(time => time.startsWith(startValues[0]))
        const endIndex = this.colTimes.findIndex(time => time.startsWith(endValues[0]))


        return this.colTimes.slice(startIndex, endIndex)

        
    }
}
