import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ubication, UbicationName, UbicationSchedule } from '../../api';
import { BecaTrabajoByUbication } from 'src/app/shared/api';

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
   * Funcion para obtener la lista de ubicaciones con id y nombre
   * @returns Observable con la lista de ubicaciones con id y nombre
   */
  getUbicationsListNames(){
    return this.http.get(`${environment.apiUrlBase}/ubications/ubications-names`).pipe(
      map((res:any) => this.mappedResponseUbicationsNames(res.ubications))
    )
  }

  /**
   * Funcion para obtener la lista de becas por ubicacion
   * @param id id de la ubicacion
   * @returns Observable con la lista de becas por ubicacion
   */
  getBecasByUbication(id: number): Observable<BecaTrabajoByUbication[]>{
    return this.http.get(`${environment.apiUrlBase}/selection/becas-selected-by-ubication?ubicationId=${id}`).pipe(
      map<any, BecaTrabajoByUbication[]>((res:any) => {
        const { becas } = res       
        return becas.map(({beca}) => ({
          code: beca.code,
          fullName: beca.full_name,
          email: beca.email,
          career: beca.career,
          address: beca.address,
          gender: beca.gender,
          status: beca.status,
          studies: beca.extra_studies,
          motivation: beca.motivation,
          photo: `${environment.mediaUrl}${beca.photo}`,
        }))
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

  /**
   * Funcion para mapear las ubicaciones con id y nombre
   * @param res Respuesta del backenm 
   * @returns lista de ubicaciones con id y nombre
   */
  private mappedResponseUbicationsNames(res:any): Array<UbicationName>{
    return res.map((ubi: any) => {
      const { id, name } = ubi
      return { id, name }
    }).sort((a: UbicationName, b: UbicationName) => {
      return a.name.localeCompare(b.name);
    });
  }

}
