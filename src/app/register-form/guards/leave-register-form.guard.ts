import type { CanDeactivateFn } from '@angular/router';
import { UnsavedForm } from '../interfaces/unsaved-form';


export const leaveRegisterFormGuard: CanDeactivateFn<UnsavedForm> = (component) => {
    if (component.unSaveForm) {
      return confirm('¿Estás seguro de que quieres salir de la página? Se perderán los datos no guardados.');
    }
  return true;
};
