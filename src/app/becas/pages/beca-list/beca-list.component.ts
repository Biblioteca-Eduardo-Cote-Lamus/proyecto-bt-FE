import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ExtraTimeComponent } from './components/extra-time/extra-time.component';
import { AddScheduleComponent } from './components/add-schedule/add-schedule.component';

@Component({
    selector: 'app-beca-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        TableModule,
        DialogModule,
        ExtraTimeComponent,
        AddScheduleComponent
    ],
    template: `
    
    <main class="p-4">

        <!-- encabezado  -->
        <section class="card">
            <h2 class="text-2xl mb-0">Listado de becas</h2>
        </section>

        <!-- seccion de filtros y acciones -->
        <section class="flex justify-content-between mb-5">
            <!-- Input de filtro -->
            <div>
            <p-inputGroup>
                <p-inputGroupAddon>
                    <i class="pi pi-search"></i>
                </p-inputGroupAddon>
                <input pInputText placeholder="Nombre, codigo, ubicacion" class="w-23rem" />
            </p-inputGroup>
            </div>
            <!-- acciones -->
            <div class="flex gap-3">
                <p-button label="Tiempo extra" 
                    icon="pi pi-clock"
                    (onClick)="openExtraTimeDialog = true"/>
                <p-button label="Agregar" 
                    icon="pi pi-plus"
                    (onClick)="openNewSchedule = true"/>
                
                <p-dropdown [options]="[{label: 'Opcion 1', value: 'Opcion 1'}]" [styleClass]="'w-13rem'" />
            </div>
        </section>

        <!-- tabla de becas -->

        <section class="bg-white p-2">

            <p-table 
                [value]="becas"
                styleClass="p-datatable-striped p-datatable-gridlines"
                [tableStyle]="{ 'min-width': '50rem' }" > 

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
                            <span class="text-xl">{{beca.name}} </span>
                        </td>
                        
                        @for (schedule of getSchedules(beca); track $index) {
                            <td style="width: 250px; text-align: center;">
                                @if (schedule.length > 0) {
                                    <ul class="list-none p-0">
                                        @for (hour of schedule; track $index) {
                                            <li class="mb-2 p-2 bg-gray-100 text-center font-bold">
                                                {{hour.inicio}} - {{hour.fin}}
                                            </li>
                                        }
                                    </ul>
                                } @else { 
                                    <span > . </span>
                                }
                            </td>
                        }

                        <td style="width: 250px; text-align: center;">
                            <span class="block w-full text-center">{{beca.total}}</span>
                        </td>
                        
                    </tr>
                </ng-template>

            </p-table>




        </section>

        @if (openExtraTimeDialog) {
            <p-dialog  
                header="Registrar tiempo extra" 
                [(visible)]="openExtraTimeDialog" 
                [modal]="true" 
                [style]="{width: '90%', maxWidth: '45rem' }"
                [draggable]="false"
                [resizable]="false"
                position="top">
                <app-extra-time (onCancel)="openExtraTimeDialog = $event" /> 
            </p-dialog>
        }

        @if (openNewSchedule) {
            <p-dialog  
                header="Agregar horario" 
                [(visible)]="openNewSchedule" 
                [modal]="true" 
                [style]="{width: '90%', maxWidth: '450px' }"
                [draggable]="false"
                [resizable]="false"
                position="top">
                <app-add-schedule (onCancel)="openNewSchedule = $event" />
            </p-dialog>
        }


    </main>
    
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecaListComponent implements OnInit {

    openExtraTimeDialog = false;
    openNewSchedule = false;

    ngOnInit(): void { }

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

    get becas(){
        return [
            {
                "name": "Angel Garcia",
                "lunes": [
                    {
                        "inicio": "12:00 am",
                        "fin": "1:00 pm"
                    },
                    {
                        "inicio": "6:00 am",
                        "fin": "8:00 am"
                    }
                ],
                "martes": [
                    {
                        "inicio": "8:30 pm",
                        "fin": "9:30 am"
                    },
                    {
                        "inicio": "8:00 am",
                        "fin": "11:00 pm"
                    }
                ],
                "miercoles": [
                    {
                        "inicio": "1:00 am",
                        "fin": "2:00 pm"
                    },
                    {
                        "inicio": "3:00 am",
                        "fin": "6:00 pm"
                    }
                ],
                "jueves": [],
                "viernes": [],
                "sabado": [],
                "total": 0
            }
        ]
    }

    getSchedules(beca: any){
        return [
            beca.lunes,
            beca.martes,
            beca.miercoles,
            beca.jueves,
            beca.viernes,
            beca.sabado
        ]
    }
}
