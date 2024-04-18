import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

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
                      @if(schedule.includes(time)  ) {
                        <td class="">
                            <span class="time-card inline-block p-2 w-4rem border-round bg-green-400 text-white transition-transform transition-duration-150 hover:shadow-1">
                                <i class="pi pi-check"></i>
                            </span>
                        </td>
                      }@else {
                        <td>.</td>
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
export class ScheduleViewComponent {
    @Input({required: true}) schedule: string[] = []

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
}
