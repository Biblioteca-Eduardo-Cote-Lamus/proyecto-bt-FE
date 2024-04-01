import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Output,
    signal,
    ViewChild,
} from '@angular/core';

// primeng imports
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// custom imports
import { DragDropDirective, FileDropped } from './dnd.directive';



@Component({
    selector: 'app-upload-file',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        ToastModule,
        DragDropDirective,
    ],
    providers: [MessageService],
    template: `
        <section>
            <!-- Upload file component -->
            <div
                DnD
                [isDraggable]="dragAndDropProps().correctFile"
                class="w-full p-5 mb-3 text-center  border-round transition-colors dashed-border"
                (fileDropped)="takeFile($event)"
            >
                <input
                    *ngIf="!dragAndDropProps().correctFile"
                    #fileInput
                    type="file"
                    class="hidden"
                    accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
                <div
                    class="flex flex-column align-items-center justify-content-center"
                >
                    <div class="bg-red-500 img-container">
                        <img
                            src="{{
                                dragAndDropProps().correctFile
                                    ? 'assets/shared/excel.svg'
                                    : 'assets/shared/upload-file.svg'
                            }}"
                            alt="upload icono"
                            class=" w-full h-full"
                        />
                    </div>
                    <p class="text-700 mb-1">
                        @if(!dragAndDropProps().correctFile){ Arrastra & suelta
                        el
                        <span class="text-red-400 font-bold">reporte</span> aquí
                        para procesarlo <br />
                        <span class="text-xl">o</span>
                        } @else {
                        <span class="text-xl inline-block my-2"
                            >¡Reporte listo para procesar!</span
                        >
                        }
                    </p>
                    @if (!dragAndDropProps().correctFile) {
                    <p-button
                        label="Buscar documento"
                        [outlined]="true"
                        severity="danger"
                        [styleClass]="
                            'hover:bg-red-500 hover:text-white transition-colors'
                        "
                        (click)="openFileBrowser()"
                    >
                    </p-button>
                    } @else {
                    <p-button
                        label="Enviar"
                        [outlined]="true"
                        severity="{{
                            !dragAndDropProps().blockUI
                                ? 'success'
                                : 'secondary'
                        }}"
                        icon="pi pi-check"
                        iconPos="right"
                        (click)="sendFile()"
                    >
                    </p-button>
                    }
                </div>
            </div>
            @if(dragAndDropProps().showErrorFile){
            <span class="inline-block mb-4 px-2"
                >Solo se aceptan documentos hoja de calculo como excel *</span
            >
            }
            <p-toast></p-toast>
        </section>
    `,
    styleUrl: './upload-file.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent {
    
    @ViewChild('fileInput') fileInputRef?: ElementRef;
    @Output() fileDropped = new EventEmitter<FileDropped>();

    dragAndDropProps = signal({
        showErrorFile: false,
        correctFile: false,
        blockUI: false,
        reportFile: null,
    });

    constructor(
        private messageService: MessageService
    ) {}

    ngOnInit(): void {}

    @HostListener('change', ['$event.target.files']) public onFileChange(
        files: FileList
    ) {
        if (files.length > 0) {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];

            for (let i = 0; i < files.length; i++) {
                if (allowedTypes.indexOf(files[i].type) === -1) {
                    this.dragAndDropProps.update((props) => ({
                        ...props,
                        showErrorFile: true,
                        correctFile: false,
                    }));
                    return;
                }
            }
            this.dragAndDropProps.update((props) => ({
                ...props,
                showErrorFile: false,
                correctFile: true,
                reportFile: files[0],
            }));
            this.messageService.clear();
            this.messageService.add({
                severity: 'success',
                summary: 'Documento seleccionado correctamente',
                detail: 'El reporte se ha seleccionado correctamente',
            });
        }
    }

    openFileBrowser() {
        this.fileInputRef.nativeElement.click();
    }

    takeFile(event: FileDropped) {
        if (!event.valid) {
            this.dragAndDropProps.update((props) => ({
                ...props,
                showErrorFile: true,
            }));
            this.messageService.add({
                severity: 'error',
                summary: 'Formato Incorrecto',
                detail: 'Solo se aceptan documentos de tipo excel.',
            });
            return;
        }
        this.dragAndDropProps.update((props) => ({
            ...props,
            showErrorFile: false,
            correctFile: true,
            reportFile: event.file,
        }));
        this.messageService.clear();
        this.messageService.add({
            severity: 'success',
            summary: 'Documento seleccionado correctamente',
            detail: 'El reporte se ha seleccionado correctamente',
        });
    }

    sendFile() {
        const { reportFile } = this.dragAndDropProps();
        this.fileDropped.emit({ file: reportFile, valid: true });
    }

}
