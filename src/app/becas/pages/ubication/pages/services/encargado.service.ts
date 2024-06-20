import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { managersMap } from '../../utils'
import { Manager, ManagerFormDTO, ManagerUpdateDTO } from '../../api';

@Injectable({
  providedIn: 'root'
})
export class EncargadoService {

  http = inject(HttpClient)

  constructor() { }

  /**
   * @description Get the list of managers
   */
  getManagersList() {
    return this.http.get(`${environment.apiUrlBase}/managers/`).pipe(
      map<any, Manager[]>((response: any) => response.map(managersMap))
    )
  }

  /**
   * @description Save the manager
   * @param manager manager to save
   */
  saveManager(manager: ManagerFormDTO) {
    return this.http.post(`${environment.apiUrlBase}/managers/`, manager).pipe(
      map<any, Manager>(managersMap)
    )
  }

  /**
   * Update the manager
   * @param manager manager to update
   * @returns Observable<Manager>
   */
  updateManager(manager: ManagerUpdateDTO) {
    return this.http.put(`${environment.apiUrlBase}/managers/update/`, manager)
  }

  /**
   * Delete the manager
   * @param id manager id
   * @returns Observable<Manager>
   */
  deleteManager(id: number) {
    return this.http.delete(`${environment.apiUrlBase}/managers/update/`)
  }

}
