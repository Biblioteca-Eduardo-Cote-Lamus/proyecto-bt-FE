
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ScheduleViewComponent } from 'src/app/components/schedule-view/schedule-view.component';
import { PreselectionTableByUbicationComponent } from '../../../selection/components/preselection-table-by-ubication/preselection-table-by-ubication.component';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { Ubication } from '../../api';

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
      [style]="{ width: '70vw' }"
      [draggable]="false"
      [resizable]="false"
      header="Informacion detallada"
      (onHide)="closeModal()"
    >
      <div class="grid p-4">
        <!-- lista de opciones -->
        <div class="col-12 md:col-2 p-0 pr-2">
          <p-listbox [options]="options" [(ngModel)]="selectedOption" ></p-listbox>
        </div>
        <div class="col-12 md:col-10 border-1 border-gray-300 border-round">
          <h3 class="p-3"> {{ selectedOption === options[0] ? 'Horario de la ubicación' : 'Becas asignados a la ubicación'}} </h3>
          <div class="p-2">
            @if (selectedOption === options[0]) {
              <app-schedule-view [schedule]="ubication.schedule" />
            }
            @if (selectedOption === options[1]) {
              <table-by-ubication />
            }
          </div>
        </div>
      </div>
      </p-dialog>
    
    `,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationInfoModalComponent { 

  @Input({required: true}) visible = false 
  @Output() visibleChange = new EventEmitter<boolean>()

  @Input({required: true}) ubication:Ubication | undefined | null
  @Output() ubicationChange = new EventEmitter<Ubication | undefined | null>()

  options = [ 'Horario', 'Listado de becas']
  selectedOption = this.options[0]

  closeModal(){
    this.visibleChange.emit(false)
    this.ubicationChange.emit(null)
  }


}
