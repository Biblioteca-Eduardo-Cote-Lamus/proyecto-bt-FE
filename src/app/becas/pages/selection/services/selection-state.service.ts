import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { ApplicantListResponse } from '../api';
import { mappedApplicantListResponse } from '../util/mappedApplicantListResponse';

@Injectable({
  providedIn: 'root'
})
export class SelectionStateService {

  private currentSelectionState: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.nextCurrentSelectionState();
  }

  get currentSelectionState$() {
    return this.currentSelectionState.asObservable();
  }

  nextCurrentSelectionState() {
    this.getCurrentStateSelection().subscribe(({currentState}: any) => {      
      this.currentSelectionState.next(currentState);
    });
  }

  getSelectionApplicants(){
    return this.http.get(`${environment.apiUrlBase}/selection/applicant-list`).pipe(
      map((response: any) => mappedApplicantListResponse(response.data))
    )
  }

  getRegisterFormState() {
    return this.http.get(`${environment.apiUrlBase}/selection/register-form-state`)
  }

  private getCurrentStateSelection() {
    return this.http.get(`${environment.apiUrlBase}/selection/current-selection-state`)
}

}
