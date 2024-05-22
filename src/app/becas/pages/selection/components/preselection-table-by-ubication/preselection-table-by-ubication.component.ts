import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from "primeng/tag";

@Component({
    selector: 'table-by-ubication',
    standalone: true,
    imports: [TableModule, ChipModule ,AvatarModule, TagModule, NgClass],
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
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-beca >
                <tr>
                    @for (key of columns; track $index) {
                      @if (key == 'fullName') {
                        <td  [pSelectableRow]="beca" class="flex align-items-center">
                            <p-avatar 
                              [image]="beca.photo" 
                              styleClass="mr-2 border-1" 
                              size="large" 
                              shape="circle" />
                          <span class="ml-1">
                              {{ beca.fullName}}
                          </span>
                        </td>
                      }@else if (key == 'status') {
                        <td [pSelectableRow]="beca" >
                           <p-tag icon="pi {{ beca['status'] == 'Candidate' ? 'pi-info-circle' : 'pi-check'  }}" severity="{{ beca['status'] == 'Candidate' ? 'warning' : 'success'  }}" [value]="beca[key]" />
                        </td>
                      } @else{
                        <td [pSelectableRow]="beca" >{{ beca[key] }}</td>
                      }
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
    @Input() list: BecaTrabajoByUbication[] = [];
    @Output() onSelectBeca = new EventEmitter<BecaTrabajoByUbication>();
    columns = [];

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.
      const {currentValue } = changes['list']
      
      if(currentValue){
        this.columns = Object.keys(currentValue[0]).slice(0, -3)
      }
    }

    onRowSelect(event: any) {
        const {data} = event
        this.onSelectBeca.emit(data)
    }
}
