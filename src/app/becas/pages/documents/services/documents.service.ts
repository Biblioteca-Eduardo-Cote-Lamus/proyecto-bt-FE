import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentDTO } from '../api';
import { documentMapped } from "../utils";

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  http = inject(HttpClient);

  constructor() { }

  /**
   * Get all documents from the API
   * @returns Observable<DocumentDTO[]> 
   */
  getDocuments() {
    return this.http.get(`${environment.apiUrlBase}/documents/`).pipe(
      map<any, DocumentDTO[]>(data => data.map( documentMapped ))
    );
  }

  /**
   * Create a new document
   * @param document 
   * @returns Observable<DocumentDTO> 
   */
  createDocument(document: FormData) {
    return this.http.post(`${environment.apiUrlBase}/documents/`, document).pipe(
      map<any, DocumentDTO>(documentMapped)
    );
  }

  /**
   * Delete a document
   * @param id id of the document to delete
   * @returns Observable<any>
   */
  deleteDocument(id: number) {
    return this.http.delete(`${environment.apiUrlBase}/documents/?id=${id}`);
  }

  downloadDocument(file: string, name: string) {
    this.http.get(file, { responseType: 'blob' }).subscribe(
      {
        next: (data: Blob) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = name;
          link.click();
          window.URL.revokeObjectURL(link.href);
        },
        error: (error) => {
          console.error('Error downloading file', error);
        }
      }

    );
  }

}
