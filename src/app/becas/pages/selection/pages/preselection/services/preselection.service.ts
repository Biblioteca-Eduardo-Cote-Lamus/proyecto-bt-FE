import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PreselectionService {

  private http = inject(HttpClient);

  constructor() { }

  getStatisticsByBeca(becaId: number | string) {
    return this.http.get(`${environment.apiUrlBase}/selection/becas-statistic?becaId=${becaId}`);
  }

}
