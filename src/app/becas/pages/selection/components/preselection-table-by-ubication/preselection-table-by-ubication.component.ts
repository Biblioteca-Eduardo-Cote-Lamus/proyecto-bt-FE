import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-preselection-table-by-ubication',
    standalone: true,
    imports: [TableModule, NgClass],
    template: `
        <p-table
            [value]="list"
            [tableStyle]="{ 'min-width': '50rem' }"
            [columns]="['Codigo', 'Nombre', 'Edad', 'Carrera', 'Correo','Direccion']"
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
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-beca let-columns="columns">
                <tr>
                    @for (col of columns; track $index) {
                      <td [ngClass]="{'flex align-items-center justify-content-center gap-3': col == 'Nombre'}">
                        @if (col === 'Nombre') {
                          <img src="assets/shared/no-user.svg" alt="imagen del usuario" class="w-3rem h-3rem">
                        }

                        {{beca[col.toLowerCase()]}}
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
    @Input() list: any = [];


}
