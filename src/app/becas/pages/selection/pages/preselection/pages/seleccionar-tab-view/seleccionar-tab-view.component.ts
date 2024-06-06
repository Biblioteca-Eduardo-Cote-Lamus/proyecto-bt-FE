import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { PreselectionTableByUbicationComponent } from '../../../../components/preselection-table-by-ubication/preselection-table-by-ubication.component';
import { ListboxModule } from 'primeng/listbox';
import { SelectItemGroup } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { UbicationService } from 'src/app/becas/pages/ubication/pages/services/ubication.service';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { DropdownModule } from 'primeng/dropdown';
import { UbicationName } from 'src/app/becas/pages/ubication/api';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-seleccionar-tab-view',
    standalone: true,
    imports: [
        CommonModule,
        ListboxModule,
        FormsModule,
        DropdownModule,
        SkeletonModule,
        PreselectionTableByUbicationComponent,
    ],
    template: `
        <div class="grid">
            <section class="col-12 md:col-3 ">
                @if (!ubications) {
                    <p-skeleton styleClass="mb-2" height="50px" />
                }@else {
                    <!-- dropdown con las ubicaciones disponibles en el sistema -->
                    <div class="mb-3 ">
                        <div class="mb-3 flex align-items-center justify-content-between px-2">
                            <div class="flex align-items-center gap-2">
                                <span class="inline-block p-2 border-circle bg-orange-400"></span>
                                <span>Candidato</span>
                            </div>
                            <div class="flex align-items-center gap-2">
                                <span class="inline-block p-2 border-circle bg-green-400"></span>
                                <span>Preseleccionado</span>
                            </div>
                        </div>
                        <p-dropdown 
                            [options]="ubications" 
                            [(ngModel)]="selectedUbication"
                            [styleClass]="'w-full'"
                            optionLabel="name"
                            placeholder="Seleccione una ubicacion" 
                            (onChange)="changeUbication($event)"/>
                    </div>
                }
                
                @if (!gropuedBecasUbication) {
                    <p-skeleton styleClass="mr-2" height="150px"/>
                } @else {
                    <p-listbox 
                        [options]="gropuedBecasUbication" 
                        [(ngModel)]="selectedBecaUbication" 
                        optionLabel="fullName" 
                        [multiple]="true" 
                        [metaKeySelection]="false" 
                        [listStyle]="{'max-height': '220px'}"
                        [filter]="true" >
                        <ng-template pTemplate="empty">
                            <p>No hay becas asignados a {{selectedUbication.name}}</p>
                        </ng-template>
                        <ng-template pTemplate="emptyfilter">
                            <p>No hay resultados que coincidan con la busqueda</p>
                        </ng-template>
                        <ng-template let-beca pTemplate="item">
                            <div class="flex w-full px-2 align-items-center justify-content-between gap-2">
                                <div class="flex align-items-center gap-2">
                                    <img 
                                        [src]="beca.photo"
                                        style="width: 40px; height: 40px;"
                                        class="border-circle border-1" />
                                    <div>
                                        {{ beca.fullName }}
                                        <span class="block"> 
                                            {{beca.career}}
                                        </span>
                                    </div>
                                </div>
                                <div class="p-2 border-circle" [ngClass]="{'bg-green-400': beca.status.toLowerCase() == 'preselected', 'bg-orange-500' : beca.status.toLowerCase() == 'candidate'}"></div>
                            </div>
                        </ng-template>
                    </p-listbox>
                }   

            </section>

            <section class="col-12 md:col-9">
                <div class="surface-card p-4 border-round border-1 border-gray-200 " >
                    <table-by-ubication [list]="selectedBecaUbication"  />
                </div>
            </section>
        </div>    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeleccionarTabViewComponent implements OnInit {

    /**
     * Lista de becas agrupadas por ubicación
     */
    gropuedBecasUbication: BecaTrabajoByUbication[];

    /**
     * Listado de los becas seleccionados
     */
    selectedBecaUbication!: any;

    /**
     * Listado de ubicaciones 
     */
    ubications: UbicationName[];

    /**
     * Servicio de ubicación
     */
    ubicationService = inject(UbicationService)

    /**
     * Ubicación seleccionada
     */
    selectedUbication: UbicationName

    /**
     * Change detector para actualizar la vista
     */
    cd = inject(ChangeDetectorRef)

    ngOnInit(): void {
        this.getUbications();
     }


    /**
     * Funcion para obtener las becas por ubicacion
     * @param id de la ubicacion para obtener las becas
     */
    getBecasByUbication(id: number) {
        this.ubicationService.getBecasByUbication(id).subscribe({
            next: becas => {
                this.gropuedBecasUbication = becas;
                this.cd.markForCheck();
            }
        })
    }

    /**
     * Funcion para cambiar la ubicacion seleccionada junto con los becas asociados para carga inicial
     */
    getUbications(){
        this.ubicationService.getUbicationsListNames().subscribe({
            next: res => {
                this.ubications = res
                this.selectedUbication = res[0]
                this.getBecasByUbication(this.selectedUbication.id)
                this.cd.markForCheck();
            }
        })
    }

    /**
     * Funcion para cambiar la ubicacion seleccionada
     * @param event evento de cambio
     */
    changeUbication(event: any){
        this.selectedUbication = event.value;
        this.gropuedBecasUbication = undefined
        this.getBecasByUbication(this.selectedUbication.id);
    }

}
