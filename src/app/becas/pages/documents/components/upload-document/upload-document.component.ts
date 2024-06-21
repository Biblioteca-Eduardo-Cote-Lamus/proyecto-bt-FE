import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DrapdropDirective } from 'src/app/shared/directives/drapdrop.directive';
import { DocumentsService } from '../../services/documents.service';
import { DocumentDTO } from '../../api';

export type onDocumentUploaded = {
  file: DocumentDTO;
  error: boolean;
  message: string;
}

@Component({
    selector: 'app-upload-document',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DrapdropDirective
    ],
    template: `
    <div class="flex gap-4">
      <div class="p-fluid">
        <div appDragdrop 
           (fileDropped)="onFileDropped($event)"
           (dragStateChanged)="onDragStateChanged($event)"
           class="drag-drop-zone p-5 border-dashed border-2  text-center"
           [ngClass]="{
             'border-400': !isDragging && !isDropped,
             'border-primary': isDragging,
             'border-success': isDropped,
           }">
        <i class="pi text-5xl mb-3" 
            [ngClass]="{
             'pi-upload': !isDropped,
             'pi-check': isDropped,
             'text-500': !isDragging && !isDropped,
             'text-primary': isDragging,
             'text-success': isDropped
           }"></i>
          <h3 class="text-lg font-semibold mb-2">
            {{ isDropped ? 'Archivos cargados correctamente' : 'Arrastra y suelta archivos aquí' }}
          </h3>
          <input type="file" #fileinput class="hidden" (input)="onSelectedFiles(fileinput)" 
                accept="image/*,.doc,.docx,.xls,.xlsx,.pdf">
        </div>
        <p-button label="Seleccionar archivo" 
          icon="pi pi-file" 
          [styleClass]="'p-button-outlined mt-3 p-fluid'"
          (onClick)="fileinput.click()"></p-button>
      </div>
      

      <!-- archivos subido -->
      <div class="pl-4 flex-1"> 

        <h4 class="text-xl">Archivo subido</h4>

        <!-- lista de ficheros -->
        @for (file of files; track $index) {
          <div class="py-3 px-4 flex justify-content-between align-items-center shadow-1 border-round">
            <div class="flex justify-content-between align-items-center gap-3">
              <i class="pi pi-file text-xl"></i>
              <input type="text" [value]="file.name" class="border-none" (input)="changeNameFile($event)">
            </div>
            <p-button icon="pi pi-trash" 
              [rounded]="true" 
              [text]="true" 
              [styleClass]="'p-1'" 
              severity="danger"
              (onClick)="onDeleteFile()" />
          </div>
        }

        @if (files) {
          
          <p-button label="Subir archivo" 
            icon="pi pi-send" iconPos='right' 
            [styleClass]="'p-button-outlined mt-3 p-fluid w-full'"
            [disabled]="!files"
            (onClick)="submitDocument()" />
        }
        
      </div>

    </div>
    
    `,
    styles: `
      .drag-over {
        background-color: rgba(0, 0, 0, 0.1);
      }

      .border-success {
        border-color: #22c55e !important;
      }

      .text-success {
        color: #22c55e !important;
      }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadDocumentComponent {

  /**
   * Estado del drag
   */
  isDragging = false;

  /**
   * Estado del drop
   */
  isDropped = false;

  /**
   * Archivos arrastrados
   */
  files: File[] | null = null;

  /**
   * Servicio de documentos
   */
  docService = inject(DocumentsService);

  @Output() onDocumentUploaded: EventEmitter<onDocumentUploaded> = new EventEmitter();

  /**
   * Obtiene los archivos arrastrados en el componente
   * @param files archivos arrastrados
   */
  onFileDropped(files: FileList) {
    this.files = Array.from(files);
    this.isDropped = true;
  }

  /**
   * Maneja el estado del drag
   * @param state estado del drag
   */
  onDragStateChanged(state: string) {

    if (state === 'dragover') {
      this.isDragging = true;
    } else if (state === 'dragleave') {
      this.isDragging = false;
    } else if (state === 'dropped') {
      this.isDragging = false;
    }
  }

  /**
   * Obtiene los archivos seleccionados
   * @param element file input element
   */
  onSelectedFiles(element: any) {
    const files = element.files;
    if (files && files.length > 0) {
      this.files = Array.from(files);
      this.isDropped = true;
    }
  }

  /**
   * Elimina un archiov de la lista de archivos subidos
   */
  onDeleteFile() {
    this.files = null;
    this.isDropped = false;
  }

  /**
   * Cambia el nombre del archivo
   * @param event evento de cambio de nombre
   */
  changeNameFile(event: any) {
    this.files[0]['newName'] = event.target.value;
  }

  /**
   * Envia el documento al servidor
   */
  submitDocument() {
    // enviar el documento
    const formData = new FormData();
    formData.append('file', this.files[0] as Blob);
    formData.append('name', this.files[0]['newName']? this.files[0]['newName'] : this.files[0].name);
    formData.append('description', '');

    this.docService.createDocument(formData).subscribe({
      next: (document) => {
        this.onDocumentUploaded.emit({
          file: document,
          error: false,
          message: 'Documento subido correctamente'
        });
      },
      error: (error) => {
        this.onDocumentUploaded.emit({
          file: null,
          error: true,
          message: 'Error al subir el documento'
        });
      }
    })

  }

 }
