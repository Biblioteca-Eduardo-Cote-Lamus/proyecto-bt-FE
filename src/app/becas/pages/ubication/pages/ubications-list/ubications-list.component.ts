import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { UbicationService } from '../services/ubication.service';
import { Ubication } from '../../api';
import { UbicationInfoModalComponent } from '../../components/ubication-info-modal/ubication-info-modal.component';

@Component({
    selector: 'app-ubications-list',
    standalone: true,
    imports: [ButtonModule, TableModule, TooltipModule,NgClass, UbicationInfoModalComponent],
    template: `
        <main class="pt-3 pr-5 lg:pl-5">
            <section  class="card flex justify-content-between align-items-center">
                <h2 class="m-0">Ubicaciones</h2>
                <p-button label="Agregar" icon="pi pi-plus" iconPos="right">
                </p-button>
            </section>

            <section class="card">
                <p-table
                    [value]="ubications()"
                    [columns]="getColumns()"
                    [tableStyle]="{ 'min-width': '50rem' }"
                    [paginator]="true"
                    [rows]="5"
                    [rowsPerPageOptions]="[5, 10, 20]"
                    styleClass="p-datatable-gridlines p-datatable-striped"
                >
                  <ng-template pTemplate="loadingbody">
                    <i class="pi pi-spin pi-spinner"></i>
                  </ng-template>

                  <ng-template pTemplate="emptymessage">
                    <i class="pi pi-spin pi-spinner"></i>
                  </ng-template>

                  <ng-template pTemplate="header" let-columns>
                      <tr>
                        @for (col of columns; track $index) {
                          <th>{{ col }}</th>
                        }
                        <th>Acciones</th>
                      </tr>
                  </ng-template>

                  <ng-template pTemplate="body" let-ubication>
                      <tr>
                          @for (col of columns(); track $index+col) {
                            <td  [ngClass]="{ 'flex flex-column xl:flex-row align-items-center justify-content-center gap-3':col === 'manager' }" >
                                @if (col === 'manager') {
                                  <img
                                      src="assets/shared/no-user.svg"
                                      alt="imagen del encargado"
                                      class="w-3rem h-3rem"
                                  />
                                  {{ ubication[col].name }}
                                } 
                                @else if (col.includes('Office')) {
                                  {{ ubication[col] ? 'Oficina': 'Diferente' }}
                                } @else {
                                  {{ ubication[col] }}
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
                                  (onClick)="openViewModal(ubication)"
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
          @if(viewModalTrigger){  
            <app-ubication-info [(visible)]="viewModalTrigger" [(ubication)]="selectedUbication" />
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
export class UbicationsListComponent implements OnInit {

    ubications = signal<Ubication[]>([])

    columns = computed(() => Object.keys(this.ubications()[0]).slice(0,-1))

    viewModalTrigger = false;

    selectedUbication: Ubication | null | undefined 

    constructor(private ubicationService: UbicationService){}

    ngOnInit(): void {

      this.ubicationService.getUbicationsList().subscribe({
        next: res => this.ubications.set(res)
      })
      
    }

    getColumns() {
        return ['ID','Ubicacion',  'Tipo horario', 'Becas asignados', 'Encargado',]
    }

    openViewModal(ubication: Ubication){
      this.viewModalTrigger=true; 
      this.selectedUbication=ubication
    }
}
