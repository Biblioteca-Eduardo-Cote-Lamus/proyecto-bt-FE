import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter } from '@angular/core';
import { PreselectionTableByUbicationComponent } from '../../../../components/preselection-table-by-ubication/preselection-table-by-ubication.component';
import { ListboxChangeEvent, ListboxClickEvent, ListboxDoubleClickEvent, ListboxModule } from 'primeng/listbox';
import { SelectItemGroup } from 'primeng/api';
import { UbicationService } from 'src/app/becas/pages/ubication/pages/services/ubication.service';
import { FormsModule } from '@angular/forms';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { InfoBecaPreselectionModalComponent } from '../../../../components/modal/info-beca-preselection-modal.component';

@Component({
    selector: 'app-preselection-tab-view',
    standalone: true,
    imports: [
        CommonModule,
        PreselectionTableByUbicationComponent,
        ListboxModule,
        FormsModule,
        InfoBecaPreselectionModalComponent
    ],
    template: `
    
    <div class="grid">
      <section class="col-12 md:col-3 ">
        @if (ubicationsGroup[0].items.length == 0) {
          <i class="pi pi-spin pi-spinner"></i>
        } @else {
          <p-listbox [options]="ubicationsGroup" [group]="true" (onClick)="changeUbication($event)" [(ngModel)]="selectedUbication" >
            <ng-template let-group pTemplate="group">
                <div class="flex align-items-center gap-3">
                    <i class="pi pi-map"></i>
                    <span>{{ group.label }}</span>
                </div>
            </ng-template>
          </p-listbox>
        }
      </section>

      <section class="col-12 md:col-9">
        <div class="surface-card p-4 border-round border-1 border-gray-200 " >
            <table-by-ubication [list]="becas" (onSelectBeca)="openBecaInfo($event)" />
        </div>
      </section>
    </div>

    @if (modalInfoBeca) {
      <app-info-beca-preselection-modal [(visible)]="modalInfoBeca" [(beca)]="becaSelected" />
    }
    
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionTabViewComponent {

  // Controla la lista de ubicaciones para el componente listBox
  ubicationsGroup:SelectItemGroup[] = [
    {
      label: 'Ubicaciones',
      value: 'Ubications',
      items:  [
      ]
    }
  ];

  // Controla la ubicacion seleccionada
  selectedUbication: number | undefined;

  // Controla la lista de becas a mostrar en la tabla
  becas: BecaTrabajoByUbication[] = []

  // controla el modal de informacion de beca
  modalInfoBeca = false

  // controla el beca seleccionado
  becaSelected: BecaTrabajoByUbication | undefined

  constructor(private ubicationService: UbicationService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.ubicationService.getUbicationsListNames().subscribe({
      next: res => {
        this.ubicationsGroup[0].items = res.map(ubi => ({ label: ubi.name, value: ubi.id }))
        this.selectedUbication = res[0].id
        this.getBecasByUbication(this.selectedUbication)
        this.cd.markForCheck()
      }
    })
    
  }

  /**
   * Obtiene la lista de becas por ubicacion
   * @param id id de la ubicacion
   */
  getBecasByUbication(id: number){

    this.ubicationService.getBecasByUbication(id).subscribe({
      next: res => {
        this.becas = res
        this.cd.markForCheck()
      }
    })

  }

  /**
   * Funcion que controla el evento de cambio de ubicacion y hacer la peticion de becas por ubicacion
   * @param event : ListboxClickEvent evento de click en el listBox
   * @returns 
   */
  changeUbication(event: ListboxClickEvent){
    const { option } = event    
    
    if(option.value === this.selectedUbication) return
    if(!this.selectedUbication) return
    
    this.selectedUbication = option.value
    this.getBecasByUbication(this.selectedUbication)
  }

  openBecaInfo(beca: BecaTrabajoByUbication){
    this.modalInfoBeca = true
    this.becaSelected = beca
  }


 }
