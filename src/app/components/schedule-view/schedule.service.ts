import { Injectable, signal } from '@angular/core';
import { UbicationSchedule } from 'src/app/becas/pages/ubication/api';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private schedule = signal<UbicationSchedule | undefined | null>(null)

  constructor() { }

  /**
   * Get the schedule of the service
   */
  get scheduleFormat(): UbicationSchedule | undefined | null {
    return {...this.schedule()}
  }

  /**
   * Set the schedule of the service
   */
  set scheduleList (schedule: UbicationSchedule){
    this.schedule.update((state) => ({...schedule}))
  }
}
