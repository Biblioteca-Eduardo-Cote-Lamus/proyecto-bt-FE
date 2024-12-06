import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BecaTrabajo, BecaTrabajoListResponse } from '../api';
import { BecaTrabajoResMap } from "../utils";

@Injectable({
  providedIn: 'root'
})
export class BecaService {

  /**
   * @description HttpCliente service to do http request
   */
  private http = inject(HttpClient)

  constructor() { }


  /**
   * @description Get the list of becas with their schedules
   * @returns Observable<BecaTrabajo[]> with the list of becas and their schedules
   */
  getBecaList() {
    return this.http.get(`${environment.apiUrlBase}/becas/`).pipe(
      map<BecaTrabajoListResponse[], BecaTrabajo[]> ( response => response.map(BecaTrabajoResMap))
    )
  }

}
