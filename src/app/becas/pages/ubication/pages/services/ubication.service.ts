import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ubication } from '../../api';

@Injectable({
  providedIn: 'root'
})
export class UbicationService {

  constructor(private http: HttpClient) { }

  getUbicationsList():Observable<Ubication[]>{
    return this.http.get(`${environment.apiUrlBase}/ubications/`).pipe(
      map<any, Ubication[]>(({ubications}:any) => ubications.map((ubi: any) => this.mappedReponse(ubi)))
    )
  }

  getManagerList(){
    return this.http.get(`${environment.apiUrlBase}/ubications/list-managers`)
  }

  registerUbication(data: FormData){
    return this.http.post(`${environment.apiUrlBase}/ubications/create-ubication`, data)
  }

  private mappedReponse(res:any):Ubication{
    const {id, name, total_becas, manager,is_schedule_office, schedule, img, description } = res
    return {
      id,
      name,
      isScheduleOffice: is_schedule_office,
      totalBecas: total_becas,
      manager,
      schedule,
      img, 
      description
    }
  }

}
