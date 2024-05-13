import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UbicationService } from '../../../pages/services/ubication.service';

@Injectable({ providedIn: 'root' })
export class BecasAssignValidator implements AsyncValidator {

  constructor(private ubicationService: UbicationService) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.ubicationService.checkIfCanAssignBecasToUbication(control.value).pipe(
        map((response:any) => {
            return response.ok ? null : {assign: true}
        }),
      catchError((error) => {
        // Manejo del error
        if (error.status === 400 && error.error.permited) {
          return of({ assign:`solo hay disponibles ${error.error.permited} cupos`});
        } else {
          return of(null);
        }
      })
    );
  }
}
