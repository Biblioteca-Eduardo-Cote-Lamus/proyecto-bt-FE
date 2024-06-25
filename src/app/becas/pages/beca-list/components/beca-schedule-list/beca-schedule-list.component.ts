import { ChangeDetectionStrategy, Component, Input, SimpleChanges, ViewChild, type OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { BecaTrabajo, Schedule } from '../../api';
import { AvatarModule } from 'primeng/avatar';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-beca-schedule-list',
    standalone: true,
    imports: [
        TableModule,
        AvatarModule,
        JsonPipe
    ],
    template: `
        <p-table 
            [value]="becas"
            styleClass="p-datatable-striped p-datatable-gridlines"
            [tableStyle]="{ 'min-width': '50rem' }"
            [paginator]="true"
            [rows]="5"
            [rowsPerPageOptions]="[5, 10, 20]" 
            [globalFilterFields]="['beca.name', 'beca.ubication.name', 'beca.id']"
            #dt2> 

            <ng-template pTemplate="emptymessage">
                <tr>
                    <td colspan="4" style="text-align: center;">No hay becas por mostrar</td>
                </tr>
            </ng-template>

            <ng-template pTemplate="header">
                <tr>
                    @for (col of columns; track $index) {
                        <th style="text-align: center;">
                            {{ col }} 
                        </th>
                    }
                </tr>
            </ng-template>

            <ng-template pTemplate="body" let-beca>
                <tr>
                    <td style="width: 250px; text-align: center;" class="bg-gray-100 text-center"> 
                        <div class="flex align-items-center justify-content-center gap-2">
                            <p-avatar 
                                [image]="beca.beca.photo"    
                                styleClass="mr-2" 
                                size="xlarge" shape="circle"  />
                            <span class="capitalize">{{beca.beca.name}} <br> {{beca.beca.lastName}} <br /> {{beca.beca.ubication.name}} </span>
                        </div>
                    </td>

                    @for (schedule of getSchedules(beca.schedule); track $index) {
                        <td>
                            <ul class="list-none p-0">
                                @if (schedule.length > 0) {

                                    @for (day of schedule; track $index) {
                                        <li class="mb-2 p-2 bg-gray-100 text-center font-bold">
                                            {{day.start}} - {{day.end}}
                                        </li>
                                    }
                                    
                                } @else {
                                    <li class="mb-2 p-2 bg-gray-100 text-center font-bold">
                                        Libre
                                    </li>
                                }
                            </ul>

                        </td>
                    }
                     
                </tr>
            </ng-template>

        </p-table>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecaScheduleListComponent implements OnInit {

    @ViewChild('dt2') dt2: Table

    /**
     * @description List of becas to show in the table 
     */
    @Input() becas: BecaTrabajo[] = []

    @Input() action: any

    ngOnInit(): void { 
    }


    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        const {currentValue,previousValue} = changes['action']

        if(currentValue) {
            this.dt2.filterGlobal(currentValue, 'contains')
        }

        if(!currentValue && previousValue) {
            this.dt2.clear()
        }
    }

    
    /**
     * @description List of columns to show in the table
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

    getSchedules(schedule: Schedule){
        return Object.keys(schedule).map(day => schedule[day])
    }

}
