import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PreselectionTableByUbicationComponent } from '../../components/preselection-table-by-ubication/preselection-table-by-ubication.component';

@Component({
    selector: 'app-preselection',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        MenuModule,
        PreselectionTableByUbicationComponent
    ],
    template: `
      <main class="">

        <div class="grid">

          <section class="col-12 md:col-2 ">
            <p-menu [model]="items" [styleClass]=" 'w-full p-2 pb-3' "></p-menu>
          </section>

          <section class="col-12 md:col-10">
            <div class="surface-card p-4 border-round border-1 border-gray-200 " >
              <app-preselection-table-by-ubication [list]="becas" />
            </div>
          </section>

        </div>



      </main>
    `,
    styles: `
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionComponent {
  items: MenuItem[] | undefined;

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

  ngOnInit() {
      this.items = [
        {
          label: 'Ubicaciones',
          iconL:'pi pi-map',
          items: [
              {
                  label: 'Update',
                  icon: 'pi pi-refresh',
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-times',
              }
          ]
      },
    ];
  }
 }
