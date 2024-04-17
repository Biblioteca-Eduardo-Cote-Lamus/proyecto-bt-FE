import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PreselectionTableByUbicationComponent } from '../../../../components/preselection-table-by-ubication/preselection-table-by-ubication.component';
import { ListboxModule } from 'primeng/listbox';
import { SelectItemGroup } from 'primeng/api';

@Component({
    selector: 'app-preselection-tab-view',
    standalone: true,
    imports: [
        CommonModule,
        PreselectionTableByUbicationComponent,
        ListboxModule
    ],
    template: `
    
    <div class="grid">
      <section class="col-12 md:col-3 ">
        <p-listbox [options]="ubicationsGroup" [group]="true" (onClick)="show($event)">
          <ng-template let-group pTemplate="group">
              <div class="flex align-items-center gap-3">
                  <i class="pi pi-map"></i>
                  <span>{{ group.label }}</span>
              </div>
          </ng-template>
        </p-listbox>
      </section>

      <section class="col-12 md:col-9">
        <div class="surface-card p-4 border-round border-1 border-gray-200 " >
          <table-by-ubication [list]="becas" />
        </div>
      </section>
    </div>
    
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionTabViewComponent {

  
  ubicationsGroup:SelectItemGroup[] = [
    {
      label: 'Ubicaciones',
      value: 'Ubications',
      items:  [
        { label: 'Carnet', value: 'Carnet'},
        { label: 'Procesos técnicos', value: 'Procesos técnicos'},
        { label: 'Pasillo 1', value: 'Pasillo 1'},
        { label: 'Pasillo 2', value: 'Pasillo 2'},
        { label: 'Archivo', value: 'Archivo'}
      ]
    }
  ];

  becas = [
    {
        codigo: '1152069',
        nombre: 'Angel Gabriel Garcia Rangel',
        correo: 'angelgabrielgara@ufps.edu.co',
        edad: '21',
        carrera: 'Ingenieria de sistemas',
        direccion: 'Tamarindo Club casa M # 38'
    },
    {
        codigo: '1152087',
        nombre: 'Enderson Joel Lizarazo',
        correo: 'angelgabrielgara@ufps.edu.co',
        edad: '22',
        carrera: 'Ingenieria de sistemas',
        direccion: 'Tamarindo Club casa M # 38'
    },
  ]

  show(event: any) {
    console.log(event);
    
  }
  


 }
