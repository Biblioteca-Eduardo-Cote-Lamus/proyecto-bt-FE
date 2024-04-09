import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {


  constructor(private http: HttpClient) { }

  checkScheduleFile(file: File)  {
    const data = new FormData()
    data.append('schedule', file as Blob)
    return this.http.post(`${environment.apiUrlBase}/selection/check-schedule-file`, data)
  }

}
