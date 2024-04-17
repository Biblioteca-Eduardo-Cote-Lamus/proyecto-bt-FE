import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { ScheduleViewComponent } from 'src/app/components/schedule-view/schedule-view.component';
import { PreselectionTableByUbicationComponent } from '../../../selection/components/preselection-table-by-ubication/preselection-table-by-ubication.component';

@Component({
    selector: 'app-ubications-list',
    standalone: true,
    imports: [ButtonModule, TableModule, TooltipModule, DialogModule, ListboxModule, FormsModule,NgClass,ScheduleViewComponent, PreselectionTableByUbicationComponent],
    template: `
        <main class="p-4">
            <section  class="card flex justify-content-between align-items-center">
                <h2 class="m-0">Ubicaciones</h2>
                <p-button label="Agregar" icon="pi pi-plus" iconPos="right">
                </p-button>
            </section>

            <section class="card">
                <p-table
                    [value]="ubications"
                    [columns]="getColumns()"
                    [tableStyle]="{ 'min-width': '50rem' }"
                    [paginator]="true"
                    [rows]="5"
                    [rowsPerPageOptions]="[5, 10, 20]"
                    styleClass="p-datatable-gridlines p-datatable-striped"
                >
                    <ng-template pTemplate="header" let-columns>
                        <tr>
                          @for (col of columns; track $index) {
                            <th>{{ col }}</th>
                          }
                          <th>Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template
                        pTemplate="body"
                        let-ubication
                        let-columns="columns"
                    >
                        <tr>
                            @for (col of columns; track $index+col) {
                            <td
                                [ngClass]="{ 'flex align-items-center justify-content-center gap-3':col === columns[3] }"
                            >
                                @if (col === columns[3]) {
                                  <img
                                      src="assets/shared/no-user.svg"
                                      alt="imagen del encargado"
                                      class="w-3rem h-3rem"
                                  />
                                  {{ ubication[col.toLowerCase()].nombre }}
                                } @else {
                                  {{ ubication[col.toLowerCase()] }}
                                }
                            </td>
                            }
                            <td class="">
                                <p-button
                                    icon="pi pi-eye"
                                    [rounded]="true"
                                    [outlined]="true"
                                    pTooltip="ver mas"
                                    tooltipPosition="top"
                                    [styleClass]="'mr-2'"
                                    (onClick)="visible=true"
                                >
                                </p-button>
                                <p-button
                                    icon="pi pi-pencil"
                                    severity="warning"
                                    [rounded]="true"
                                    [outlined]="true"
                                    pTooltip="editar"
                                    tooltipPosition="top"
                                >
                                </p-button>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </section>
          @if(visible){  
            <p-dialog
                [(visible)]="visible"
                [modal]="true"
                maskStyle="backdrop-filter: blur(2px);"
                [style]="{ width: '70vw' }"
                [draggable]="false"
                [resizable]="false"
                header="Informacion detallada"
            >
              <div class="grid p-4">
                <!-- lista de opciones -->
                <div class="col-12 md:col-2 p-0 pr-2">
                  <p-listbox [options]="options" [(ngModel)]="selectedOption" ></p-listbox>
                </div>
                <div class="col-12 md:col-10 border-1 border-gray-300 border-round">
                  <h3 class="p-3"> {{ selectedOption === options[0] ? 'Horario de la ubicación' : 'Becas asignados a la ubicación'}} </h3>
                  <div class="p-2">
                    @if (selectedOption === options[0]) {
                      <app-schedule-view />
                    }
                    @if (selectedOption === options[1]) {
                      <table-by-ubication />
                    }
                  </div>
                </div>
              </div>
            </p-dialog>
          }
        </main>
    `,
    styles: `
    :host {
      display: block;
    }
    tr,th,td{
      text-align: center
    }
    .con{
      background-image: radial-gradient(circle at left top, var(--primary-400), var(--primary-700))
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationsListComponent {
    ubications = [
        {
            nombre: 'Carnets',
            horario: 'Especial',
            becas: 7,
            encargado: {
                nombre: 'Angel Garcia',
                photo: null,
            },
        },
        {
            nombre: 'Carnets',
            horario: 'Especial',
            becas: 7,
            encargado: {
                nombre: 'Angel Garcia',
                photo: null,
            },
        },
    ];

    visible = false;

    options = [
      'Horario', 'Listado de becas', 
    ]

      selectedOption = this.options[0]

    getColumns() {
        return Object.keys(this.ubications[0]).map(
            (key) =>
                `${key[0].toUpperCase()}${key
                    .slice(1, key.length)
                    .toLowerCase()}`
        );
    }
}
