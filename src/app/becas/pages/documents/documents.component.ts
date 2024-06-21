import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { onDocumentUploaded, UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { DocumentsService } from './services/documents.service';
import { DocumentDTO } from './api';
import { map } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Documents extends DocumentDTO {
  menu: MenuItem[];
}

@Component({
    selector: 'app-documents',
    standalone: true,
    providers: [MessageService, ConfirmationService],
    imports: [
        CommonModule,
        ButtonModule,
        MenuModule,
        DialogModule,
        UploadDocumentComponent,
        ToastModule,
        ConfirmDialogModule
    ],
    template: `
    <main class="px-4">
      <section class="card p-4 mb-4 flex justify-content-between align-items-center">
        <h2 class="mb-0 text-xl">Documentos</h2>
        <p-button label="Subir documento" icon="pi pi-upload" [rounded]="true" (onClick)="openDialog = true" />
      </section>

      <!-- seccion con los documentos subidos al sistemas -->
      <section>

        <h4 class="text-xl px-2">Documentos disponibles</h4>

        <div class="card-container">
          @for (item of documents; track $index) {
            <div class="card p-4">
              <!-- encaebzado de la card -->
              <div class="flex justify-content-between align-items-center mb-3">
                <i class="pi pi-file text-xl"></i>
                <p-button icon="pi pi-ellipsis-v" [rounded]="true" [text]="true" (click)="menu.toggle($event)" />
              </div>
              <!-- contenido de la card -->
              <div class="mb-4">
                <h4 class="text-xl"> {{item.name}} </h4>
                <span class="text-grey-400">
                  {{ item.dateCreated | date }} - {{ item.size }}
                </span>
              </div>
              <!-- footer -->
              <div class="flex justify-content-center gap-3">
                <p-button label="Descargar"  icon="pi pi-download"  severity="info" (onClick)="downloadDocument(item)" />
                <p-button label="Eliminar"  icon="pi pi-trash"  severity="danger" (onClick)="openConfirmDialog(item.id)" />
              </div>
              <p-menu #menu [model]="item.menu"  [popup]="true" >
              </p-menu>
            </div>
          }
        </div>

        @if (openDialog) {
          <p-dialog 
            header="Header" 
            [(visible)]="openDialog" 
            [modal]="true" 
            [style]="{ width: '90%', maxWidth: '700px'}"
            [draggable]="false"
            position="top">
            <ng-template pTemplate="header">
                <div class="inline-flex align-items-center justify-content-center gap-2">
                    <i class="pi pi-file text-xl"></i>
                    <span class="font-bold white-space-nowrap">
                        Subir documento
                    </span>
                </div>
            </ng-template>
            <app-upload-document (onDocumentUploaded)="addNewDocument($event)" />
          </p-dialog>
        }
        <p-toast />
        <p-confirmDialog />
      </section>

    </main>
    
    
    `,
    styles: `
    .card-container{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }
    .card {
      margin-bottom: 1rem; 
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent { 

  /**
   * List of documents
   */
  documents: Documents[]

  /**
   * State of the dialog
   */
  openDialog = false;

  /** 
   * Service to get the documents
   */
  docService = inject(DocumentsService);

  /**
   * Change detector to update the view
   */
  cdr = inject(ChangeDetectorRef);

  /**
   * Service to show messages
   */
  messageService = inject(MessageService);

  /**
   * Service to show confirm dialog
   */
  confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.onLoadDocuments();
  } 

  /**
   * Function to get all documents from the API
   */
  onLoadDocuments() {
    this.docService.getDocuments().pipe(
      map<DocumentDTO[], Documents[]>(data => data.map(this.mappedDocuments))
    ).subscribe({
      next: (res) => {
        this.documents = res;
        this.cdr.markForCheck();
      }
    })
  }

  addNewDocument(event: onDocumentUploaded) {
    const {error, file, message} = event

    if(!error) { 
      this.documents = [...this.documents, this.mappedDocuments(file)]
      this.messageService.add({ severity: 'success', summary: 'Documento subido', detail: message });
    }

    if(error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
    }

    this.openDialog = false;

  }

  /**
   * Map the response from the API to the format that the component needs
   * @param data response from the API in DocumentDTO format
   * @returns Object with the menu property
   */
  private mappedDocuments (data: DocumentDTO) {
    return {
      ...data,
      menu: [
        {
          label: 'Ver',
          icon: 'pi pi-eye text-yellow-500',
          url: data.file,
        },
      ]
    }
  }

  /**
   * Method to open the confirm dialog
   * @param id id of the document to delete
   */
  openConfirmDialog(id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de que quieres eliminar este documento?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-info-circle',
      rejectButtonStyleClass:"p-button-text",
      acceptLabel:"Si",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
          this.deleteDocument(id);
      },
      reject: () => {
      }
  });
  }


  /**
   * Delete a document from the API
   * @param id id of the document to delete
   */
   deleteDocument (id: number) {
    this.docService.deleteDocument(id).subscribe({
      next: () => {
        this.documents = this.documents.filter( item => item.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Documento eliminado', detail: 'El documento ha sido eliminado correctamente' });
        this.cdr.markForCheck();
      }
    })   
  }

  /**
   * Method to download a document
   * @param file file to download
   */
  downloadDocument(file: DocumentDTO) {
    this.docService.downloadDocument(file.file, file.name)
  }


}
