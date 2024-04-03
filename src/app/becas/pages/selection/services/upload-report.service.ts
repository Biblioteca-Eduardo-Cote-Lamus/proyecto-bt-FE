import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mappedReportResponse } from '../util/mappedReportResponse';

@Injectable({
    providedIn: 'root',
})
export class UploadReportService {
    constructor(private http: HttpClient) {}

    getReportData(formData: FormData) {
        return this.http
            .post(`${environment.apiUrlBase}/selection/upload`, formData)
            .pipe(map((response: any) => mappedReportResponse(response)));
    }
}
