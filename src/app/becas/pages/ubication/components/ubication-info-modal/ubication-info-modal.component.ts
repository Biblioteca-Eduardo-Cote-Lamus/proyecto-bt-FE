
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ScheduleViewComponent } from 'src/app/components/schedule-view/schedule-view.component';
import { PreselectionTableByUbicationComponent } from '../../../selection/components/preselection-table-by-ubication/preselection-table-by-ubication.component';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { Ubication } from '../../api';
import { ScheduleService } from 'src/app/components/schedule-view/schedule.service';
import { UbicationService } from '../../pages/services/ubication.service';

@Component({
    selector: 'app-ubication-info',
    standalone: true,
    imports: [
      DialogModule,
      ListboxModule,
      FormsModule,
      ScheduleViewComponent, 
      PreselectionTableByUbicationComponent
    ],
    template: `
    
    <p-dialog
      [(visible)]="visible"
      [modal]="true"
      maskStyle="backdrop-filter: blur(2px);"
      [style]="{ width: '80%', height: '800px', boxShadow: 'none', overflowY: 'auto', overflowX: 'hidden'}"
      [draggable]="false"
      [resizable]="false"
      header="Informacion detallada"
      (onHide)="closeModal()"
      [dismissableMask]="true"
    >
      <ng-template pTemplate="headless">
        <div class="grid p-4">
          <!-- lista de opciones -->
          <div class="col-12 md:col-2 p-0 pr-2 pb-2">
            <p-listbox [options]="options" [(ngModel)]="selectedOption" ></p-listbox>
          </div>
          <div class="col-12 md:col-10 bg-white border-round">
            <h3 class="p-3"> {{ selectedOption === options[0] ? 'Horario de la ubicación' : 'Becas asignados a la ubicación'}} </h3>
            <div class="p-2">
              @if (selectedOption === options[0]) {
                @if (!state().loading) {
                  <app-schedule-view [schedule]="ubication.schedule" />
                } @else if (state().error) {
                  <p>Hubo un error al cargar el horario</p>
                } @else {
                  <p>Cargando...</p>
                  <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                }
              }
              @if (selectedOption === options[1]) {
                <table-by-ubication />
              }
            </div>
          </div>
        </div>
      </ng-template>
      </p-dialog>
    
    `,
    styles: `
    
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationInfoModalComponent implements OnChanges{ 

  @Input({required: true}) visible = false 
  @Output() visibleChange = new EventEmitter<boolean>()

  @Input({required: true}) ubication:Ubication | undefined | null
  @Output() ubicationChange = new EventEmitter<Ubication | undefined | null>()

  options = [ 'Horario', 'Listado de becas']
  selectedOption = this.options[0]

  state = signal({
    loading: true,
    error: false,
    success: false
  })
  
  constructor(private scheduleService: ScheduleService, private ubicationService: UbicationService){}

  ngOnChanges(changes: SimpleChanges): void {
    const {ubication} = changes
    if(ubication){
      const { id } = ubication.currentValue
 
      if(id){

        if(localStorage.getItem('schedule')){
          const items = JSON.parse(localStorage.getItem('schedule'))
          const item = items.find((item: any) => item.ubicationId === id)
          if(item){
            this.scheduleService.scheduleList = item.schedule
            this.state.update((state) => ({success: true, error:false, loading: false}))
            return
          }
        }

        this.ubicationService.getScheduleByUbication(id).subscribe({
          next: schedule => {
            this.state.update((state) => ({success: true, error:false, loading: false}))
            this.scheduleService.scheduleList = schedule
            
            const items = localStorage.getItem('schedule') ? JSON.parse(localStorage.getItem('schedule')) : []

            if(items){
              items.push({ubicationId: id, schedule})
              localStorage.setItem('schedule', JSON.stringify(items))
            }

          },
          error: () => this.state.update((state) => ({success: false, error:true, loading: false})),
        })
      
      }
    }
      
  }

  closeModal(){
    this.visibleChange.emit(false)
    this.ubicationChange.emit(null)
  }


}
