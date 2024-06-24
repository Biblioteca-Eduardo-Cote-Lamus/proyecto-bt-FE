import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { PreselectionTableByUbicationComponent } from '../../../../components/preselection-table-by-ubication/preselection-table-by-ubication.component';
import { ListboxChangeEvent, ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { UbicationService } from 'src/app/becas/pages/ubication/pages/services/ubication.service';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { DropdownModule } from 'primeng/dropdown';
import { UbicationName } from 'src/app/becas/pages/ubication/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PreselectionService } from '../../services/preselection.service';
import { DialogModule } from 'primeng/dialog';
import { AddScheduleComponent, Actions, onChangeSchedule, AddSchedule } from 'src/app/becas/pages/beca-list/components/add-schedule/add-schedule.component';
import { environment } from 'src/environments/environment';
import { totalHours } from 'src/app/becas/pages/beca-list/utils';
import { ConfirmScheduleTableComponent } from '../../../../components';

interface SelectedBeca {
    error: boolean;
    loading: boolean;
    beca: BecaTrabajoByUbication;
    data: any;
}

@Component({
    selector: 'app-seleccionar-tab-view',
    standalone: true,
    imports: [
        CommonModule,
        ListboxModule,
        FormsModule,
        DropdownModule,
        SkeletonModule,
        ButtonModule,
        ConfirmDialogModule,
        ToastModule,
        DialogModule,
        AddScheduleComponent,
        ConfirmScheduleTableComponent,
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
                        [filter]="true"
                        (onChange)="onSelectBeca($event)" >
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
                <p-button label="Notificar" [styleClass]="'mb-3'"  (onClick)=" notifyBecasPopup()" />
                @if (!notifiedBecas) {
                    <p-skeleton styleClass="mb-2" height="50px" />
                }@else {
                    <div class="surface-card p-4 border-round border-1 border-gray-200" >
                        <table-by-ubication 
                            [list]="notifiedBecas" 
                            [dismissBecaButtonFlag]="true" 
                            (onAcceptBeca)="onAcceptBeca($event)" />
                             
                    </div>
                }
            </section>
        </div>    

        @if (openScheduleModal) {
            <p-dialog 
                header="Horarios" 
                [(visible)]="openScheduleModal" 
                [style]="{width: '90%', maxWidth: '450px' }"
                [draggable]="false"
                [resizable]="false"
                position="top"
                [modal]="true"
                [closeOnEscape]="false"> 
                
                
                @if (selectedBeca().loading) {
                    <p-skeleton styleClass="mr-2" height="150px"/>
                }

                @if (!selectedBeca().error && !selectedBeca().loading) {
                    <app-add-schedule 
                        [beca]="selectedBeca().beca" 
                        [coveredHours]="selectedBeca().data" 
                        [action]="ActionsA.CREATE_AND_EMIT"
                        (onChange)="sendData($event)"  />
                }
                
                
                
                <ng-template pTemplate="footer">
                    <div class="w-full flex justify-content-start">
                        <p-button label="Ver horario" [styleClass]="'mr-2'" (onClick)="openScheduleFile()" />
                    </div>
                </ng-template>
                
            </p-dialog>
        }

        @if (confirmScheduleDialogData().show) {
            <p-dialog 
                header="Confirmar horario" 
                [(visible)]="confirmScheduleDialogData().show" 
                [style]="{width: '90%'}"
                [draggable]="false"
                [resizable]="false"
                position="top"
                [modal]="true"> 
                
                <app-confirm-schedule-table [becas]="confirmScheduleDialogData().data" />
                <ng-template pTemplate="footer">
                    <p-button label="Confirmar horario" [styleClass]="'mr-2'" (onClick)="saveSchedule()" />
                </ng-template>
            </p-dialog>
        }



        <p-toast />
        <p-confirmDialog />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ConfirmationService, MessageService]
})
export class SeleccionarTabViewComponent implements OnInit {

    /**
     * Lista de becas agrupadas por ubicación
     */
    gropuedBecasUbication: BecaTrabajoByUbication[];

    /**
     * Listado de los becas seleccionados para el ngModel
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

    /**
     * Servicio de confirmación del modal para notificar a los becas seleccionados
     */
    confirmationService = inject(ConfirmationService)

    /**
     * Servicio de mensajes para mostrar mensajes en la vista
     */
    messageService = inject(MessageService)

    /**
     * Servicio de preselección para notificar a los becas seleccionados
     */
    preselectionService = inject(PreselectionService)

    /**
     * Listado de becas notificados
     */
    notifiedBecas: BecaTrabajoByUbication[]

    /**
     * Bandera para mostrar el modal de horarios
     */
    openScheduleModal: boolean = false;

    /**
     * Senal para mostrar la información de la beca seleccionada y su horario para ser enviado al componente add-schedule
     */
    selectedBeca = signal<SelectedBeca>({ error: false, loading: false, beca: {} as BecaTrabajoByUbication, data: {} })

    /**
     * Bandera para mostrar el modal de confirmación de horario
     */
    confirmScheduleDialogData = signal({
        show: false,
        data: []
    })


    ngOnInit(): void {
        this.getUbications();
        this.getNotifiedBecas();
    }

    get ActionsA (){
        return Actions
    }


    /**
     * Funcion para obtener las becas por ubicacion
     * @param id de la ubicacion para obtener las becas
     */
    getBecasByUbication(id: number) {
        this.ubicationService.getBecasByUbication(id).subscribe({
            next: becas => {
                this.gropuedBecasUbication = becas;    
                this.selectedBecaUbication = becas.filter(beca => beca.notified)

                
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
     * Funcion que obtiene la lista de los becas notificados
     */
    getNotifiedBecas(){
        this.preselectionService.getNotifiedBecas().subscribe({
            next: res => {
                this.notifiedBecas = res
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
        this.getBecasByUbication(this.selectedUbication.id);
    }

    /**
     * Funcion para notificar a los becas seleccionados
     */
    notifyBecasPopup(){
        this.confirmationService.confirm({
            message: '¿Estas seguro de notificar a los becas seleccionados?',
            header: 'Notificar becas',
            icon: 'pi pi-info-circle',
            rejectButtonStyleClass:"p-button-text",
            acceptIcon:"pi pi-check",
            rejectIcon:"pi pi-times",
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.notifyBecasAction()
            },
        });
    }

    /**
     * Funcion para notificar a los becas seleccionados por correo electronico.
     */
    notifyBecasAction(){

        // extraemos los becas que no hayan sido notificados en caso de que se seleccionen nuevos
        const becasToNotify = this.selectedBecaUbication.filter((beca: BecaTrabajoByUbication) => !beca.notified).map((beca: BecaTrabajoByUbication) => beca.code)
        
        // validamos que se haya seleccionado al menos un beca
        if(becasToNotify.length == 0 || !becasToNotify){
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Debe seleccionar al menos un beca'});
            return
        }

        // hacemos el llamado a la API para notificar a los becas seleccionados
        this.preselectionService.notifyBecas(becasToNotify).subscribe({
            next: (res:any) => {
                window.location.reload();
            },
            error: (err:any) => {
                this.messageService.clear();
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error al notificar a los becas'});
            }
        })
    }

    onSelectBeca(event: ListboxChangeEvent){
       const value = event.value[ event.value.length - 1 ]

       // si no hay valor, eso quiere decir que no hayu becas seleccionados (ni notificados)
       if(!value){
           this.notifiedBecas = []
       }

       const isInSelectedBecasUbication = this.selectedBecaUbication.find((beca: BecaTrabajoByUbication) => beca.code == value.code)

       if(isInSelectedBecasUbication){
            this.notifiedBecas = [...this.notifiedBecas, value]
       } else {
            this.notifiedBecas = this.notifiedBecas.filter((beca: BecaTrabajoByUbication) => beca.code != value.code)
       }

        this.cd.markForCheck();
    }

    /**
     * Funcion para aceptar una beca
     * @param event Beca seleccionado
     */
    onAcceptBeca(event: BecaTrabajoByUbication){

        this.openScheduleModal = true
        this.selectedBeca.set({ error: false, loading: true, beca: event, data: {} })

        this.preselectionService.getStatisticsByBeca(event.code).subscribe({
            next: (res: any) => {
                const { infoPerDay } = res.data
                this.selectedBeca.set(
                    { 
                        error: false, 
                        loading: false, 
                        beca: event, 
                        data: infoPerDay.map((info: any) => ({ day: info.day, coveredHours: info.coveredHours }))
                    })
            },
            error: (err: any) => {
                this.selectedBeca.update( state => ({
                    loading: false,
                    error: true,
                    ...state
                }))
                this.openScheduleModal = false
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error al obtener la información de la beca'});
            }
        })

    }

    /**
     * Abre el horario del beca en una nueva ventana
     */
    openScheduleFile(){
        const {code} = this.selectedBeca().beca
        window.open(`${environment.mediaUrl}becas-trabajo/${code}/horario/${code}.pdf`, '_blank')
    }

    sendData(event: onChangeSchedule){
        const { action, beca, schedule} = event

        if(action === Actions.CREATE_AND_EMIT){

            // // validamos que se cumplan las horas minimas  
            const minHours = totalHours(schedule)

            // mostramos otro modal para confirmar el envio de los datos
            this.confirmScheduleDialogData.set({
                show: true,
                data: [
                    {
                        beca,
                        schedule: schedule.map( ({ hours }) => hours),
                        originalSchedule: schedule,
                        totalHours: minHours
                    }
                ]
            })

        }

    }


    saveSchedule(){

        const {beca, totalHours, originalSchedule} = this.confirmScheduleDialogData().data[0]

        if(totalHours < 10) {
            this.messageService.add({severity:'error', summary: 'No cumple las horas minimas', detail: 'El horario debe tener al menos 10 horas de trabajo'});
            return
        }

        const data = {
            becaId: Number(beca.code),
            schedule: originalSchedule,
            ubicationId: beca.ubication.id
        }
        
        this.preselectionService.selectBeca(data).subscribe({
            next: (res: any) => {
                // quitamos al beca de la lista de notificados
                this.notifiedBecas = this.notifiedBecas.filter((beca: BecaTrabajoByUbication) => beca.code != this.selectedBeca().beca.code)
                // cerramos los modales 
                this.confirmScheduleDialogData.set( { show: false, data: [] })
                this.openScheduleModal = false
                this.messageService.add({severity:'success', summary: 'Becas seleccionado', detail: res.msg});

            },
            error: (err: any) => {
                console.log(err);
                
                this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error al guardar el horario'});
            }
        })
        
    }


}
