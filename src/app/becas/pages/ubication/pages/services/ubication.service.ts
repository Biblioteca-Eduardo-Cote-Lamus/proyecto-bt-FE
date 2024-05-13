import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ubication, UbicationSchedule } from '../../api';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  constructor(private http: HttpClient) { }

  /**
   * Funcion que obtiene la lista de ubicaciones en el sistema
   * @returns Observable<Ubication[]> lista de las ubicaciones en el sistema
   */
  getUbicationsList():Observable<Ubication[]>{
    return this.http.get(`${environment.apiUrlBase}/ubications/`).pipe(
      map<any, Ubication[]>(({ubications}:any) => ubications.map((ubi: any) => this.mappedReponse(ubi)))
    )
  }

  /**
   * Funcion que obtiene la lista de los encargados de las ubicaciones
   * @returns Observable<any> lista de los encargados de las ubicaciones
   */
  getManagerList(){
    return this.http.get(`${environment.apiUrlBase}/ubications/list-managers`)
  }

  /**
   * Funcion para crear una nueva ubicacion en el sistema
   * @param data FormData con la informacion de la ubicacion
   * @returns Observable con la respuesta de la peticion
   */
  registerUbication(data: FormData){
    return this.http.post(`${environment.apiUrlBase}/ubications/create-ubication`, data)
  }

  /**
   * Funcion para verificar si se pueden asignar la cantidad becas a la ubicacion
   * @param amount cantidad de becas a asignar
   * @returns Observable con la respuesta de la peticion
   */
  checkIfCanAssignBecasToUbication(amount: number){
    const params = new HttpParams().set('amount', amount)
    return this.http.get(`${environment.apiUrlBase}/ubications/check-total-becas`, { params })
  }
  
  /**
   * Funcion para actualizar la informacion permitida de la ubicacion
   * @param data FormData con la informacion de la ubicacion a actualizar
   * @returns Observable con la respuesta de la peticion
   */
  updatedUbication(data: FormData){
    return this.http.patch(`${environment.apiUrlBase}/ubications/update-ubication`, data)
  }

  /**
   * Funcion para obtener el horario de la ubicacion
   * @param id id de la ubicacion
   * @returns Observable con la informacion de la ubicacion
   */
  getScheduleByUbication(id: number): Observable<UbicationSchedule>{
    return this.http.get(`${environment.apiUrlBase}/ubications/schedule-by-ubication?id=${id}`).pipe(
      map((res:any) => {
        const { schedule } = res
        return {
          scheduleType: schedule.scheduleType,
          schedule: schedule.schedule,
          scheduleFormat: schedule.schedule_format
        }
      })
    )
  }

  /**
   * Funcion para mapear la respuesta de la peticion
   * @param res respueta de la peticion
   * @returns Ubication ubicacion mapeada
   */
  private mappedReponse(res:any):Ubication{
    const {id, name, total_becas, manager, schedule, img, description } = res
    return {
      id,
      name,
      totalBecas: total_becas,
      manager,
      schedule,
      img, 
      description
    }
  }

}
