import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

// primeng imports
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AccordionModule } from 'primeng/accordion';

// custom imports
import { DragDropDirective } from './dnd.directive';

@Component({
    selector: 'app-upload-file',
    standalone: true,
    imports: [
        CommonModule,
        RippleModule,
        ButtonModule,
        AccordionModule,
        DragDropDirective
    ],
    template: `
        <section> 
            <!-- Upload file component -->
            <div DnD  class="w-full p-5 mb-3 text-center  border-round transition-colors dashed-border" (fileDropped)="takeFile($event)"> 
                <input #fileInput type="file" class="hidden" accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
                    <div class="flex flex-column align-items-center justify-content-center">
                        <div class="bg-red-500 w-3rem h-3rem mb-3 border-circle flex justify-content-center align-content-center" style="padding: 12px">
                            <img src="assets/shared/upload-file.svg" alt="upload icono" class=" w-full h-full">
                        </div>
                        <p class="text-700 mb-1">
                            Arrastra & suelta el <span class="text-red-400 font-bold">reporte</span> aquí para procesarlo <br>
                            <span class="text-xl">o</span>
                        </p>
                        <p-button 
                            label="Buscar documento" 
                            [outlined]="true" 
                            severity="danger"
                            [styleClass]="'hover:bg-red-500 hover:text-white transition-colors'"
                            (click)="openFileBrowser()"
                            >
                        </p-button>
                    </div>   
                </div>
                @if(showErroFile){
                    <span>Solo se aceptan documentos hoja de calculo como excel</span>
                }
            <p-accordion  > 
                <p-accordionTab header="Listado de postulados" [disabled]="true"> 

                </p-accordionTab>
            </p-accordion>

            
        </section>
    `,
    styleUrl: './upload-file.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileComponent {


    @ViewChild('fileInput') fileInputRef?: ElementRef;
    showErroFile = false;
    constructor() { }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    openFileBrowser() {
        this.fileInputRef.nativeElement.click();
    }

    takeFile(event: any) {
       if(typeof event === 'boolean' && !event) {
           this.showErroFile = true;
           return
       }
       this.showErroFile = false;
    }

 }
// class="btn border-red-400 outline-none p-2 cursor-pointer border-round text-red-400 hover:bg-red-500 hover:text-white"