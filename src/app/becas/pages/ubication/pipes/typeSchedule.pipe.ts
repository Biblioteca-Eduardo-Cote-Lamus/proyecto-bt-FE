import { Pipe, type PipeTransform } from '@angular/core';
import { TYPES_SCHEDULE } from '../components/ubication-form/const/ubication-schedule.const'

@Pipe({
  name: 'typeSchedule',
  standalone: true,
})
export class TypeSchedulePipe implements PipeTransform {

  transform(value: string): unknown {
    return TYPES_SCHEDULE.find((type) => type.key === value)?.name || value;
  }

}
