import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectionStateService } from '../../services/selection-state.service';
import { ApplicantList } from '../../api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { environment } from 'src/environments/environment';
import { ExtendedFormDateModalComponent } from '../../components/modal/extended-form-date-modal.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
    selector: 'app-beca-info',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        TagModule,
        ProgressSpinnerModule,
        BadgeModule,
        ExtendedFormDateModalComponent,
        ToastModule,
        InputTextModule,
        ButtonModule,
        ConfirmDialogModule
    ],
    template: `
        @if (formState() !== null && !formState().available) {
            <app-modal (dateChange)="updateDate($event)" />
        }
        <div class="card">
            <div class="text-center flex flex-wrap gap-3 justify-content-evenly align-items-center">
                @if (formState() !== null) {
                    <p class="font-bold  mb-0">
                        <span
                            class="flex align-items-center gap-2 justify-content-center"
                        >
                            <span
                                class="inline-block border-circle w-1rem h-1rem"
                                [ngClass]="{
                                    'bg-green-400': formState().available,
                                    'bg-red-500': !formState().available
                                }"
                            ></span>
                            Formulario Habilitado
                        </span>
                        <span class="block font-normal">{{
                            formState().available
                                ? 'El formulario se encuentra habilitado'
                                : 'El formulario ha cerrado.'
                        }}</span>
                    </p>
                    <p class="font-bold mb-0">
                        Tiempo restante
                        <span class="block font-normal">
                            {{ formState().timeLeft.days }} día
                            {{ formState().timeLeft.hours }} horas y
                            {{ formState().timeLeft.minutes }} minutos
                        </span>
                    </p>
                    <p class="font-bold mb-0">
                        Habilitado hasta
                        <span class="block font-normal">
                            <i class="pi pi-calendar"></i>
                            {{ formState().untilAvailable | date : 'dd/MM/yyyy' }}
                        </span>
                    </p>
                } @else {
                    <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
                }
            </div>
        </div>
        <section class="card">
            <p-table
                #dt1
                [value]="applicantList()"
                [paginator]="true"
                [rows]="10"
                [columns]="['Nombre', 'Email', 'Formulario enviado']"
                responsiveLayout="scroll"
                styleClass="p-datatable-striped"
                [globalFilterFields]="['fullName', 'email', 'representative.name', 'status']"
                [rowsPerPageOptions]="[5, 10, 20]"
            >
            <ng-template pTemplate="caption">
                <div class="flex">
                    <button pButton label="Limpiar filtros" class="p-button-outlined" icon="pi pi-filter-slash" (click)="clear(dt1)"></button>
                    <span class="p-input-icon-left ml-auto">
                        <i class="pi pi-search"></i>
                        <input pInputText type="text" (input)="dt1.filterGlobal($event.target.value, 'contains')" placeholder="Buscar por nombre o correo..." />
                    </span>
                </div>
            </ng-template>
                <ng-template pTemplate="header" let-columns>
                    <tr>
                        @for (col of columns; track $index) {
                            <th 
                                class="text-center"
                                [pSortableColumn]="getSortProp(col)" 
                            >
                                {{ col }}
                                <p-sortIcon [field]="getSortProp(col)" *ngIf="col !== columns[2]" />
                                @if (col === columns[2]) {
                                    <p-columnFilter type="boolean" field="sendedForm"></p-columnFilter>
                                }
                            </th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-applicant>
                    <tr>
                        <td class="text-center flex align-items-center gap-3">
                            <img
                                [src]="getImage(applicant.photo)"
                                alt="foto de {{
                                    applicant.fullName.toLowerCase()
                                }} "
                                class="w-3rem h-3rem border-circle"
                            />
                            {{ applicant.fullName.toLowerCase() }}
                        </td>
                        <td class="text-center">{{ applicant.email }}</td>
                        <td class="text-center">
                            <p-tag
                                *ngIf="!applicant.sendedForm"
                                severity="danger"
                                icon="pi pi-ban"
                            />
                            <p-tag
                                *ngIf="applicant.sendedForm"
                                severity="success"
                                icon="pi pi-check"
                            />
                        </td>
                    </tr>
                </ng-template>
                <ng-template pTemplate="summary"> 
                    <div class="flex justify-content-end">
                        <button pButton 
                            label="Confirmar y avanzar" 
                            class="p-button-outlined p-button-success" 
                            icon="pi pi-angle-right" 
                            iconPos="right"
                            (click)="showConfirmCurrentStateModal()"
                        >
                        </button>
                    </div>
                </ng-template>
            </p-table>
            <p-toast />
            <p-confirmDialog #cd2>
                <ng-template  pTemplate="headless" let-message>
                    <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
                    <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                        <i class="pi pi-send text-5xl"></i>
                    </div>
                        <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                        <p class="mb-0 mx-auto text-center" style="max-width: 500px;">{{ message.message }}</p>                        
                        <div class="flex align-items-center gap-2 mt-4">
                            <button pButton label="No, deseo quedarme " (click)="cd2.reject()" class="p-button-outlined  "></button>
                            <button pButton label="Sí, deseo avanzar" (click)="cd2.accept()" class=""></button>
                        </div>
                    </div>
                </ng-template>
            </p-confirmDialog>
        </section>
    `,
    styleUrl: './beca-info.component.css',
    providers: [MessageService, ConfirmationService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecaInfoComponent {
    applicantList = signal<ApplicantList[]>([]);
    formState = signal<any>(null);

    constructor(
        private selectionService: SelectionStateService, 
        private message: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.selectionService.getSelectionApplicants().subscribe({
            next: (res) => {
                this.applicantList.set(res);
            },
        });
        this.selectionService.getRegisterFormState().subscribe({
            next: (res) => {
                this.formState.set(res);
            },
        });
    }

    getImage(url: string) {
        if (url == null) return 'assets/shared/no-user.svg';
        return `${environment.apiUrlBase}${url}`;
    }

    updateDate(event: Date){
        this.selectionService.extendedLimitDate(event).subscribe({
            next: () => window.location.reload(),
            error: (err) => {
                this.message.clear()
                this.message.add({ severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error. Contacte con sorporte' });
            }
        })
    }

    getSortProp(col: string){
        // ['Nombre', 'Email', 'Formulario enviado']"
        const props = {
            'Nombre': 'fullName',
            'Email': 'email',
            'Formulario enviado' : 'sendedForm'
        }
        return props[col]
    }

    showConfirmCurrentStateModal(){
        this.confirmationService.confirm({
            message: 'Esta accion es irreversible.',
            header: '¿Esta seguro que desea avanzar?',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                this.selectionService.registerFormDone()
                
            },
            reject: () => {
                
            }
        });
    }
}
