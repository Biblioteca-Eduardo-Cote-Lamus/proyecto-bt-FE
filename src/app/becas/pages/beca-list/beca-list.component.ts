import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, type OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ExtraTimeComponent } from './components/extra-time/extra-time.component';
import { AddScheduleComponent } from './components/add-schedule/add-schedule.component';
import { BecaScheduleListComponent } from './components';
import { BecaService } from './service';
import { BecaTrabajo } from './api';
import { UbicationName, UbicationService } from '../ubication';
import { tap } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';


type becaState = {
    loading: boolean,
    error: boolean,
    data: BecaTrabajo[] | null | undefined
}

type ubicationsState = {
    loading: boolean,
    error: boolean,
    data: UbicationName[] | null | undefined
}

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
        DialogModule,
        FormsModule,
        ExtraTimeComponent,
        AddScheduleComponent,
        BecaScheduleListComponent,
        SkeletonModule
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
                @if (becaState().loading) {
                    <p-skeleton width="500px" height="40px" />
                } 
                @if(becaState().data) {
                    <p-inputGroup>
                        <p-inputGroupAddon>
                            <i class="pi pi-search"></i>
                        </p-inputGroupAddon>
                        <input 
                            pInputText 
                            placeholder="Nombre, codigo, ubicacion" 
                            class="w-23rem"
                            [(ngModel)]="action" />
                    </p-inputGroup>
                }
            </div>
            <!-- acciones -->
            <div class="flex gap-3">

                
                @if (ubicationsState().loading) {
                    <p-skeleton width="500px" height="40px" />
                } 

                @if(ubicationsState().data) {
                    <p-button 
                        label="Tiempo extra" 
                        icon="pi pi-clock"
                        (onClick)="openExtraTimeDialog = true"/>
                    
                    <!-- <p-button 
                        label="Agregar" 
                        icon="pi pi-plus"
                        (onClick)="openNewSchedule = true"/> -->

                    <p-dropdown 
                        [options]="ubicationsState().data" 
                        optionLabel="name" 
                        [styleClass]="'w-13rem'"
                        [showClear]="true"
                        placeholder="Filtrar por ubicacion"
                        (onChange)="setActionFromDropDown($event)" />
                }
            </div>
        </section>

        <!-- tabla de becas -->

        <section class="bg-white p-2">

            @if (becaState().loading) {
                <span>cargando...</span>
                <p-skeleton width="100%" height="150px" />
            }

            @if (becaState().error) {
                <span>Ha ocurrido un error inesperado :( </span>
            }

            @if (becaState().data) {
                <app-beca-schedule-list [becas]="becaState().data" [action]="action" />
            }
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

        <!-- @if (openNewSchedule) {
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
        } -->


    </main>
    
    
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecaListComponent implements OnInit {

    /**
     * @description Flag to open the dialog to add extra time
     */
    openExtraTimeDialog = false;

    /**
     * @description Flag to open the dialog to add a new schedule
     */
    openNewSchedule = false;

    /**
     * @description Service to do all the request to the backend
     */
    becaService = inject(BecaService)

    /**
     * @description Service to do all the request to the backend
     */
    ubicationService = inject(UbicationService)

    /**
     * @description State of the becas
     */
    becaState = signal<becaState>({
        loading: false,
        error: false,
        data: null
    })

    /**
     * @description State of the ubications
     */
    ubicationsState = signal<ubicationsState>({
        loading: false,
        error: false,
        data: null
    })

    /**
     * @description Action to filter the becas
    */
    action: any

    ngOnInit(): void { 
        this.loadBecas()
        this.loadUbications()
    }

    /**
     * @description Load the becas from the backend
     */
    loadBecas() {
        this.becaState.update(state => ({...state, loading: true}))

        this.becaService.getBecaList().subscribe({
            next: beca => {
                this.becaState.set({loading: false, error: false, data: [...beca]})
            },
            error: err => {
                this.becaState.set({loading: false, error: true, data: null})
            }
        })
    }

    /**
     * @description Load the ubications from the backend
     */
    loadUbications() {
        this.ubicationsState.update(state => ({...state, loading: true}))

        this.ubicationService.getUbicationsListNames().subscribe({
            next: ubications => {
                this.ubicationsState.set({loading: false, error: false, data: [...ubications]})
            },
            error: err => {
                this.ubicationsState.set({loading: false, error: true, data: null})
            }
        })
    }

    setActionFromDropDown(event: DropdownChangeEvent){
        const {value} = event
        
        if(value) {
            this.action = value.name
        } else {
            this.action = undefined
        }
        
    }



}
