import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private schedule = signal([])

  constructor() { }

  /**
   * Get the schedule of the service
   */
  get scheduleFormat(){
    return this.schedule()
  }

  /**
   * Set the schedule of the service
   */
  set scheduleList (schedule: string[]){
    this.schedule.update((state) => [...schedule])
  }
}
