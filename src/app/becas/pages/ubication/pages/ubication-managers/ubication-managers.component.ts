import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { EncargadoService } from '../services/encargado.service';
import { Manager } from '../../api';
import { TableModule } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ManagerFormComponent, saveManger } from '../../components/manager-form/manager-form.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-ubication-managers',
    standalone: true,
    providers: [ConfirmationService, MessageService],
    imports: [
        CommonModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        TableModule,
        SkeletonModule,
        DialogModule,
        ManagerFormComponent,
        ConfirmDialogModule,
        ToastModule,
        FormsModule
    ],
    template: `
    <p-toast />
    <main class="px-4">
      <section class="card">
        <h2 class="mb-0">Lista de Encargados</h2>
      </section>

      <!-- busqueda y  boton de agregar-->
      <section class="grid mb-4">
        <!-- input para filtar -->
        <div class="col-6">

        </div>

        <!-- boton para agregar -->
        <div class="col flex justify-content-end">
            <p-button label="Agregar" icon="pi pi-plus" iconPos="left" (onClick)="openNewManagerDialog = true" />
        </div>
      </section>

      <!-- listado de los encargados aca -->

      <section class="card">
        <p-table 
          [value]="managersList"
          dataKey="id"
          [tableStyle]="{ 'min-width': '75rem' }"
          [paginator]="true"
          [rows]="10"
          [rowsPerPageOptions]="[5, 10, 20]"
          [globalFilterFields]="['firstName', 'lastName', 'email', 'id']"
          #dt
        >          
          <ng-template pTemplate="caption">
              <div class="flex">
                <div class="ml-auto">
                  <p-inputGroup>
                    <p-inputGroupAddon>
                        <i class="pi pi-search"></i>
                    </p-inputGroupAddon>
                    <input type="text" pInputText placeholder="Nombre, codigo, correo" (input)="dt.filterGlobal($event.target.value, 'contains')"  />
                  </p-inputGroup>
                </div>
              </div>
          </ng-template>
          <ng-template pTemplate="header">
              <tr>
                  <th pSortableColumn="isActive" style="width: 10%;">
                      estado <p-sortIcon field="isActive" />
                  </th>
                  <th pSortableColumn="firstName" style="width:20%">
                      Usuario <p-sortIcon field="firstName" />
                  </th>
                  <th pSortableColumn="email" style="width:20%">
                      Correo <p-sortIcon field="email" />
                  </th>
                  <th pSortableColumn="rol" style="width:20%">
                      Rol <p-sortIcon field="rol" />
                  </th>
                  <th pSortableColumn="id" style="width: 10%;">
                      ID <p-sortIcon field="id" />
                  </th>
                  <th style="width:20%">
                      Acciones
                  </th>
              </tr>
          </ng-template>
          <ng-template pTemplate="body" let-manager>
              <tr>
                  <td>
                      @if (manager.isActive) {
                        <span class="inline-block p-2 bg-green-400 border-circle"></span>
                      } @else {
                        <span class="inline-block p-2 bg-red-400 border-circle"></span>
                      }
                  </td>
                  <td>
                      {{ manager.firstName }} {{ manager.lastName }}
                  </td>
                  <td>
                      {{ manager.email }}
                  </td>
                  <td>
                      {{ manager.rol }}
                  </td>
                  <td>
                      {{ manager.id }}
                  </td>
                  <td>
                    <div class="flex gap-2 justify-content-center">
                      <p-button icon="pi pi-pencil" iconPos="left" (click)="selectedManager = manager; openNewManagerDialog = true" />
                      <p-button icon="pi pi-trash" iconPos="left" severity="danger" (onClick)="deleteManager()" />
                    </div>
                  </td>
              </tr>
          </ng-template>
        </p-table>
      </section>

      @if (openNewManagerDialog) {
          <p-dialog 
            header=" {{ selectedManager ? 'Editar encargado' : 'Agregar encargado'   }}  " 
            [(visible)]="openNewManagerDialog" 
            [modal]="true" 
            [style]="{ width: '90%', maxWidth: '700px'}" 
            [draggable]="false" 
            [resizable]="false"
            [position]="'top'"
            (visibleChange)="selectedManager = null" >
            <app-manager-form (saveManager)="saveManager($event)" [manager]="selectedManager"  />
        </p-dialog>
      }
      <p-confirmDialog />
  
    </main>

    `,
    styles: `
    td,tr,th {
      text-align: center;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationManagersComponent {

  /**
   * @description Service to manage the managers
   */
  managerService = inject(EncargadoService)

  /**
   * @description Change detector reference
   */
  cdr = inject(ChangeDetectorRef)

  /**
   * @description List of managers
   */
  managersList: Manager[];

  /**
   * @description Selected manager to updated info, delete or view
   */
  selectedManager: Manager;

  /**
   * @description Flag to open the dialog to create a new manager
   */
  openNewManagerDialog: boolean

  /**
   * @description Confirmation service
   */
  confirmationService = inject(ConfirmationService)

  /**
   * @description Message service
   */
  messageService = inject(MessageService)

  /**
   * @description Search input value
   */
  search = ''

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadManagers()
  }

  /**
   * @description Load the managers list from API
   */
  loadManagers() {
    this.managerService.getManagersList().subscribe({
      next: res => {
        this.managersList = [...res];
        this.cdr.markForCheck();
      }
    })
  }

  /**
   * @description Save the manager
   * @param manager manager to save
   */
  saveManager(event: saveManger) {
    this.openNewManagerDialog = false
    const { manager, action } = event

    if(action == 'save'){
      this.managersList = [...this.managersList, manager]
    }

    if(action == 'update'){
      this.managersList = this.managersList.map(m => m.id == manager.id ? manager : m)
    }

  }

  /**
   * @description Open the dialog confirm to delete the manager
   */
  deleteManager() {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este encargado?',
      header: 'Confirma la eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
          this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Se ha eliminado al encargado' });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la accion', life: 3000 });
      }
  });
  }

}
