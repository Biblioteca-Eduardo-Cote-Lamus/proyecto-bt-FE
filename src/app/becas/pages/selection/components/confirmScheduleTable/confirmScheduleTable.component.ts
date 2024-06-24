import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, type OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Hours, onChangeSchedule } from '../../../beca-list/components/add-schedule/add-schedule.component';


interface Schedule {
    fullName: string;
    schedule: Hours[];
    totalHours: number;
}

@Component({
    selector: 'app-confirm-schedule-table',
    standalone: true,
    imports: [
        CommonModule,
        TableModule
    ],
    template: `
    
    <p-table 
        [value]="becas"
        styleClass="p-datatable-striped p-datatable-gridlines" > 

        <ng-template pTemplate="header">
            <tr>
                @for (col of columns; track $index) {
                    <th style="text-align: center;">{{ col }}</th>
                }
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-beca>
            <tr >
                <td style="width: 250px; text-align: center;" class="bg-blue-900 text-white"> 
                    <span class="text-xl">{{beca.beca.fullName}} </span>
                </td>
                
                @for (sch of beca.schedule; track $index) {
                    <td style="width: 250px; text-align: center;">
                        @if (sch.length > 0) {
                            <ul class="list-none p-0">
                                @for (hour of sch; track $index) {
                                    <li class="mb-2 p-2 bg-gray-100 text-center font-bold">
                                        {{hour.start}} - {{hour.end}}
                                    </li>
                                }
                            </ul>
                        } @else { 
                            <span class="inline-block mb-2 p-2 bg-gray-100 text-center font-bold"> Libre </span>
                        }
                    </td>
                }

                <td style="width: 250px; text-align: center;">
                    <span class="block w-full text-center">{{beca.totalHours}}</span>
                </td>
                
            </tr>
        </ng-template>

    </p-table>
    
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmScheduleTableComponent implements OnInit {

    /**
     * Nombre de los becas a mostrar
     */
    @Input() becas: Schedule[] = []


    /**
     * Columnas de la tabla
     */
    get columns (){
        return [
            'Beca',
            'Lunes',
            'Martes',
            'Miercoles',
            'Jueves',
            'Viernes',
            'Sabado',
            'Total Horas',
        ]
    }

    ngOnInit(): void { }

}
