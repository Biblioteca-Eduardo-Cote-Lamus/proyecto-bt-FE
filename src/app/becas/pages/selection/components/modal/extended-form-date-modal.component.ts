import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, ConfirmDialogModule,CalendarModule, FormsModule],
    template: ` 
       <p-confirmDialog #cd [styleClass]="'fadeindown animation-duration-1000'">
        <ng-template pTemplate="headless" let-message>
            <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
              <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                  <i class="pi pi-calendar-plus text-5xl"></i>
              </div>

                <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
                <p class="mb-0 mx-auto text-center" style="max-width: 500px;">{{ message.message }}</p>
                
                <div class="mt-3">
                  <label class="block w-full text-center mb-2 font-bold">Seleccione la fecha</label>
                  <p-calendar [minDate]="minDate" [(ngModel)]="date" [iconDisplay]="'input'" [showIcon]="true" ></p-calendar>
                  <span class="text-sm block w-full">Se extendera por defecto 1 dia si da click en si</span>
                </div>
                
                <div class="flex align-items-center gap-2 mt-4">
                  <button pButton label="No" (click)="cd.reject()" class="p-button-outlined  "></button>
                    <button pButton label="Sí" (click)="cd.accept()" class=""></button>
                </div>
            </div>
        </ng-template>
      </p-confirmDialog> 
    `,
    styles: `
    :host {
      display: block;
    }
  `,
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtendedFormDateModalComponent implements OnInit{

  @Output() dateChange = new EventEmitter<Date>()
  date = new Date()

  
  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
      this.confirm()
      this.date.setDate(this.date.getDate() + 1)
  }

  get minDate(){
    return new Date()
  }

  confirm() {
        this.confirmationService.confirm({
          message: 'El tiempo del formulario de registro a terminado. Parece ser que hay aspirantes que aun no han enviado la información.',
          header: '¿Desea extender el tiempo de registro?',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon:"none",
          rejectIcon:"none",
          rejectButtonStyleClass:"p-button-text",
          accept: () => {
              this.dateChange.emit(this.date)
          },
          reject: () => {
              
          }
      });
  }


}
