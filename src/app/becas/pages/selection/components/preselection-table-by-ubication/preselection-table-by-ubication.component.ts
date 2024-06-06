import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from "primeng/tag";
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'table-by-ubication',
    standalone: true,
    imports: [TableModule, ChipModule ,AvatarModule, TagModule, ButtonModule, NgClass],
    template: `
        <p-table
            [value]="list"
            [tableStyle]="{ 'min-width': '50rem' }"
            [columns]="['Codigo', 'Nombre', 'Correo', 'Carrera', 'Direccion', 'Genero', 'Estado']"
            selectionMode="single"
            (onRowSelect)="onRowSelect($event)" 
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 20, 30]"
            [showCurrentPageReport]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            styleClass="p-datatable-striped"
        >
            <ng-template pTemplate="emptymessage">
                <div class="p-4">Tabla vacia, nada por mostrar</div>
            </ng-template>

            <ng-template pTemplate="header" let-columns>
                <tr>
                    @for (col of columns; track $index) {
                      <th [pSortableColumn]="col.toLowerCase()" >
                        {{col}}
                        <p-sortIcon [field]="col.toLowerCase()"></p-sortIcon>
                      </th>
                    }
                    @if (dismissBecaButtonFlag) {
                      <th>Descartar</th>
                    }
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-beca >
                <tr [pSelectableRow]="beca">
                  <td  >{{ beca.code }}</td>

                  <td   class="flex align-items-center">
                      <p-avatar 
                        [image]="beca.photo" 
                        styleClass="mr-2 border-1" 
                        size="large" 
                        shape="circle" />
                    <span class="ml-1">
                        {{ beca.fullName}}
                    </span>
                  </td>

                  <td>{{ beca.email }}</td>
                  <td>{{ beca.career }}</td>
                  <td>{{ beca.address }}</td>
                  <td>{{ beca.gender }}</td>

                  <td >
                      <p-tag icon="pi {{ beca['status'] == 'Candidate' ? 'pi-info-circle' : 'pi-check'  }}" 
                             severity="{{ beca['status'] == 'Candidate' ? 'warning' : 'success'  }}" [value]="beca.status" />
                  </td>


                    @if (dismissBecaButtonFlag) {
                      <td>
                        <p-button icon="pi pi-times" [rounded]="true" severity="danger" />
                      </td>
                    }
                </tr>
            </ng-template>
        </p-table>
    `,
    styles: `
    tr, td, th {
      text-align: center;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionTableByUbicationComponent {

    /**
     * Lista de becas por ubicacion
     */
    @Input() list: BecaTrabajoByUbication[] = [];

    /**
     * Evento para notificar cuando un beca es seleccionado
     */
    @Output() onSelectBeca = new EventEmitter<BecaTrabajoByUbication>();

    /**
     * Columnas de la tabla a mostrar. Se calculan a partir de un objeto de la lista
     */
    columns = [];

    /**
     * Bandera para mostrar el boton de descartar beca. Por defecto es falso.
     * Importante: Activar esta bandera solo si se quiere mostrar el boton de descartar beca
     */
    @Input() dismissBecaButtonFlag = false;

    /**
     * Evento para emitir el beca que se va a descartar. 
     */
    @Output() onDismissBeca = new EventEmitter<BecaTrabajoByUbication>()

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
      const {currentValue } = changes['list']

      if(currentValue && currentValue.length > 0){
        this.columns = Object.keys(currentValue[0]).slice(0, -2)  
      }
    }

    onRowSelect(event: any) {
        const {data} = event
        this.onSelectBeca.emit(data)
    }
}
