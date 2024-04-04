import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectionStateService } from '../../services/selection-state.service';
import { ApplicantList } from '../../api';

@Component({
    selector: 'app-beca-info',
    standalone: true,
    imports: [CommonModule, TableModule, TagModule],
    template: `
        <div class="card">
            <div class="text-center flex flex-gap justify-content-evenly align-items-center">
                <p class="font-bold  mb-0">
                    Formulario Habilitado<br>
                    <span class="font-normal">El formulario se encuentra habilitado.</span>
                </p>
                <p class="font-bold mb-0">
                    Tiempo restante
                    <span class="block font-normal">00:00:00</span>
                </p>
                <p class="font-bold mb-0">
                    Habilitado hasta
                    <span class="block font-normal">
                        <i class="pi pi-calendar"></i>    
                        Abril 30, 2024
                    </span>
                </p>
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

    constructor(private selectionService: SelectionStateService) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.selectionService.getSelectionApplicants().subscribe({
            next: (res) => {
               this.applicantList.set(res);
            },
        });
    }
}
