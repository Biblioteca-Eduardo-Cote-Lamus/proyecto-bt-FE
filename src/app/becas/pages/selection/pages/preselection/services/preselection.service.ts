import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AddSchedule } from 'src/app/becas/pages/beca-list/components/add-schedule/add-schedule.component';
import { BecaTrabajoByUbication } from 'src/app/shared/api';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreselectionService {

  private http = inject(HttpClient);

  constructor() { }

  /**
   * Metodo que hace la peticion a la API para obtener las estadisticas del beca seleccionado.
   * @param becaId id del beca a generar las estadisticas 
   * @returns Observable con la respuesta de la peticion
   */
  getStatisticsByBeca(becaId: number | string) {
    //TODO: Tipar el retorno de la peticion
    return this.http.get(`${environment.apiUrlBase}/selection/becas-statistic?becaId=${becaId}`);
  }

  /**
   * Metodo que hace la peticion a la API para notificar a los becas seleccionados
   * @param becas lista de los ids de los becas a notificar
   * @returns Observable con la respuesta de la peticion
   */
  notifyBecas(becas: number[] | string[]){
    return this.http.post(`${environment.apiUrlBase}/selection/notify-becas-email`, { becasIds: becas })
  }

  /**
   * Metodo que hace la peticion a la API para obtener la lista de becas notificados
   * @returns Observable con la respuesta de la peticion
   */
  getNotifiedBecas(){
    return this.http.get(`${environment.apiUrlBase}/selection/list-notifies-becas`).pipe(
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
          photo: `${environment.mediaUrl}${beca.photo}`,
          percentage: beca.percentage,
          notified: beca.notified,
          motivation: beca.motivation,
          studies: beca.extra_studies,
          ubication: beca.ubication
        }))
      })
    )
  }

  /**
   * Funcion que hace la peticion a la API para seleccionar una beca y crear su horario. 
   * @param data Informacion de la beca seleccionada: {  becaId: codigo del beca, schedule: horario del beca }
   * @returns Observable con la respuesta de la peticion
   */
  selectBeca(data: { becaId: number | string, schedule: AddSchedule, ubicationId: number}){
    return this.http.post(`${environment.apiUrlBase}/selection/select-beca`, data)
  }

}
