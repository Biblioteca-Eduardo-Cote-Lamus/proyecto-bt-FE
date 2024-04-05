import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectionStateService } from '../../services/selection-state.service';
import { ApplicantList } from '../../api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
@Component({
    selector: 'app-beca-info',
    standalone: true,
    imports: [CommonModule, TableModule, TagModule, ProgressSpinnerModule,BadgeModule],
    template: `
        <div class="card">
            <div class="text-center flex flex-wrap gap-3 justify-content-evenly align-items-center">
                @if (formState() !== null) {
                    <p class="font-bold  mb-0"> 
                        <span  class="flex align-items-center gap-2 justify-content-center">
                            <span class="inline-block border-circle w-1rem h-1rem" [ngClass]="{'bg-green-400': formState().available, 'bg-red-500': !formState().available}"></span>
                            Formulario Habilitado
                        </span>
                        <span class="block font-normal">{{ formState().available ? 'El formulario se encuentra habilitado' : 'El formulario ha cerrado.'}}</span>
                    </p>
                    <p class="font-bold mb-0">
                        Tiempo restante
                        <span class="block font-normal">
                            {{ formState().timeLeft.days }} día {{ formState().timeLeft.hours }} horas y {{ formState().timeLeft.minutes }} minutos
                        </span>
                    </p>
                    <p class="font-bold mb-0">
                        Habilitado hasta
                        <span class="block font-normal">
                            <i class="pi pi-calendar"></i>    
                            {{ formState().untilAvailable | date: 'dd/MM/yyyy' }}
                        </span>
                    </p>
                } @else {
                    <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
                }
                
            </div>
        </div>
        <section class="card">
            <p-table
                [value]="applicantList()"
                [paginator]="true"
                [rows]="10"
                [columns]="['ID', 'Nombre', 'Email',  'Estado', 'Rol', 'Formulario enviado']"
                responsiveLayout="scroll"
                styleClass="p-datatable-striped"
            >
                <ng-template pTemplate="header" let-columns>
                    <tr>
                        @for (col of columns; track $index) {
                            <th class="text-center">{{ col }}</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-applicant>
                    <tr>
                        <td class="text-center">{{ applicant.id }}</td>
                        <td class="text-center">{{ applicant.firstName.toLowerCase() }} {{ applicant.lastName.toLowerCase() }}</td>
                        <td class="text-center">{{ applicant.email }}</td>
                        <td class="text-center">{{ applicant.isActive ? 'Activo' : 'Inactivo' }}</td>
                        <td class="text-center">{{ applicant.rol.rol }}</td>
                        <td class="text-center">
                            <p-tag severity="danger" value="No" icon="pi pi-ban" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </section>
    `,
    styleUrl: './beca-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecaInfoComponent {
    applicantList = signal<ApplicantList[]>([]);
    formState = signal<any>(null);
    constructor(private selectionService: SelectionStateService) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.selectionService.getSelectionApplicants().subscribe({
            next: (res) => {
               this.applicantList.set(res);
            },
        });
        this.selectionService.getRegisterFormState().subscribe({
            next: res => {
                this.formState.set(res);
            }
        });
    }
}
