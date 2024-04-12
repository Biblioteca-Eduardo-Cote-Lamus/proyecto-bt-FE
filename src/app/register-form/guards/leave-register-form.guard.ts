import type { CanDeactivateFn } from '@angular/router';
import { UnsavedForm } from '../interfaces/unsaved-form';


export const leaveRegisterFormGuard: CanDeactivateFn<UnsavedForm> = (component) => {
    if (component.unSavedForm()) {
      return confirm('¿Estás seguro de que quieres salir de la página? Se perderán los datos no guardados.');
    }
  return true;
};
