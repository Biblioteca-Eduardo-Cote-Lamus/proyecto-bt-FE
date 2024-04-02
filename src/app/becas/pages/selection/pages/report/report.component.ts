import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {  TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { UploadFileComponent } from '../../components/upload-file/upload-file.component';
import { FileDropped } from '../../components/upload-file/dnd.directive';
import { environment } from 'src/environments/environment';
import { CalendarModule } from 'primeng/calendar';



@Component({
    selector: 'app-report',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        ButtonModule,
        TableModule,
        ToastModule,
        CalendarModule,
        UploadFileComponent
    ], 
    providers: [MessageService],
    template: `
    
        <section> 

        <p-accordion [activeIndex]="activeIndex"> 
            <p-accordionTab header="Cargar reporte" [disabled]="activeIndex != 0" [headerStyleClass]="'text-red-500'"> 
                @if (activeIndex === 0) {
                    <app-upload-file (fileDropped)="takeReport($event)" />
                }
            </p-accordionTab>

            <p-accordionTab header="Listado de postulados" [headerStyleClass]="'text-red-500'" [disabled]="activeIndex !== 1">
                    <div class="flex flex-row-reverse justify-content-start gap-3 mb-4">
                            <p-button
                                label="Confirmar lista"
                                [outlined]="true"
                                severity="success"
                                icon="pi pi-check"
                                iconPos="right"
                                (onClick)="confirmReport()"
                            >
                            </p-button>
                            <p-button
                                label="Cargar otro documento"
                                [outlined]="true"
                                severity="warning"
                                icon="pi pi-check"
                                iconPos="right"
                                (onClick)="reSendFile()"
                            >
                            </p-button>
                    </div>
                    <p-table
                        [value]="reponseBack()"
                        [paginator]="true"
                        [rows]="10"
                        responsiveLayout="scroll"
                        styleClass="p-datatable-striped"
                        [columns]="['Codigo','Documento','Nombre','Promedio', 'Correo', 'Telefono']"
                    >
                        <ng-template pTemplate="header" let-cols>
                            <tr class="text-center">
                                @for (item of cols; track item) {
                                    <th class="text-center">{{ item}}</th>
                                }
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-candidate let-columns="columns">
                            <tr >
                                @for (item of columns; track $index+item) {
                                    <td class="text-center">{{ candidate[item.toLowerCase()] }}</td>
                                }
                            </tr>
                        </ng-template>
                    </p-table>
                    
            </p-accordionTab>

            <p-accordionTab header="Fecha limite" [headerStyleClass]="'text-red-500'" [disabled]="activeIndex !== 2">
                <p class="mb-4">Seleccione la fecha limite de subida de información para los inscritos</p>
                <div class="flex justify-content-center">
                    <p-calendar class="max-w-full"  [inline]="true"  [minDate]="getMinDate()"></p-calendar>                        
                </div>
                <div class="flex justify-content-end">
                    <p-button
                        label="Confirmar y enviar"
                        [outlined]="true"
                        severity="success"
                        icon="pi pi-check"
                        iconPos="right"
                    >
                    </p-button>
                </div>
            </p-accordionTab>
            </p-accordion> 
            <p-toast ></p-toast>
        </section>
    
    
    `,
    styleUrl: './report.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportComponent {

    activeIndex = 0;
    reponseBack = signal<any>([]);

    constructor(
        private http: HttpClient, 
        private messageService: MessageService
    ) {}

    
    ngOnInit(): void {

        if (localStorage.getItem('upload-report')) {
            const {report, activeIndex} = JSON.parse(localStorage.getItem('upload-report') || '{}')
            this.reponseBack.set(report);
            this.activeIndex = activeIndex;
        }
    }

    getMinDate() {
        const currentDay = new Date()
        currentDay.setDate(currentDay.getDate() +1)
        return currentDay
    }
    
    confirmReport(){
        this.activeIndex +=1;
        const reportData = JSON.parse(localStorage.getItem('upload-report'))
        reportData.activeIndex = this.activeIndex
        localStorage.setItem('upload-report', JSON.stringify(reportData))
    }

    takeReport(event: FileDropped) {
        const formData = new FormData();
        formData.append('file', event.file as File);
        this.http
            .post(`${environment.apiUrlBase}/selection/upload`, formData)
            .pipe(
                map((response: any) => {
                    const { data } = response;
                    const candidates = [];
                    for (const candidate of data) {
                        candidates.push({
                            codigo: candidate.CODIGO,
                            documento: candidate.DOCUMENTO,
                            nombre: candidate.APELLIDOS_Y_NOMBRES,
                            promedio: candidate.PROMEDIO,
                            correo: candidate.EMAIL_UFPS,
                            telefono: candidate.CELULAR,
                        });
                    }

                    return candidates;
                })
            )
            .subscribe({
                next: (response) => {
                    this.reponseBack.set(response);
                    localStorage.setItem(
                        'upload-report',
                        JSON.stringify({report: response, activeIndex: this.activeIndex+1})
                    );
                    this.activeIndex += 1;
                    this.messageService.clear();
                    this.messageService.add({ severity: 'success', summary: 'Lista generada', detail: 'Se ha generado la lista de postulantes exitosamente.' });
                },

                error: (error) => {
                    console.error('error', error);
                },
            });
    }

    reSendFile() {
        localStorage.removeItem('candidates');
        this.activeIndex = 0;
        this.reponseBack.set([]);
    }
 }
