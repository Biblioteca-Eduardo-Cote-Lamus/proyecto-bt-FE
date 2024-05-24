import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { EscarapelaComponent } from 'src/app/components/escarapela/escarapela.component';
import { BecaTrabajoByUbication, Modal } from 'src/app/shared/api';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { BecaSchedule, InforPerDay, PreselectionScheduleViewComponent } from '../preselection-schedule-view/preselection-schedule-view.component';
import { PreselectionService } from '../../pages/preselection/services/preselection.service';
import { StatisticsUbication } from '../../pages/preselection/api';

@Component({
    selector: 'app-info-beca-preselection-modal',
    standalone: true,
    imports: [
        DialogModule,
        EscarapelaComponent,
        ChartModule,
        ButtonModule,
        PreselectionScheduleViewComponent,
        NgClass
    ],
    template: `
      <p-dialog 
        header="Header" 
        [(visible)]="visible" 
        [modal]="true" 
        [style]="{ width: '90vw', boxShadow: 'none', overflowY: 'auto', overflowX: 'hidden' }"
        [draggable]="false" 
        [resizable]="false"
        maskStyle="backdrop-filter: blur(2px);">

        <ng-template pTemplate="headless">
          
        <!-- contenedor general -->
        <section class="grid mr-3 ">

          <!-- escarapela container -->
            <div class="col-3 ">

              <div class="">
                  <app-escarapela [beca]="beca" />
                  <!-- opciones extras -->
                  <div class="mt-4 flex flex-column gap-2 bg-white w-full border-round py-2">
                    @for (option of optionsSelect; track $index) {
                      <p-button 
                        [styleClass]="'w-full '" 
                        [ngClass]="{'bg-gray-100': option == optionSelected}" 
                        [label]="option" [text]="true" 
                        (onClick)="onSelectOption(option)" severity="secondary" />
                    }
                  </div>
              </div>

            </div>
          
            @if( ! statisticsState().loading){
              <!-- Dashboard container -->
              @if (optionSelected === optionsSelect[0]) {
                <div class="col ml-4 ">
                  <div class="container-modal border-round p-4 mb-4">
                    <h2 class="mb-0">Informacion de seleccion</h2>
                  </div>
                  <!-- dashboard -->
                  <section class="bg-gray-100 p-4 border-round">
                  
                    <!-- porcentajes -->
                    <div class="flex h-12rem w-full gap-3  mb-5 ">
                      @for (card of getPercentagesCardData(); track $index) {
                        <div class="flex flex-column px-4 text-center w-full h-full bg-white py-3 shadow-1 border-round">
                          <div class="text-left mb-3">
                            <p class="percentaje-title font-bold">{{card.title}}</p>
                          </div>
                          <div class="">
                            <div class="flex  justify-content-center align-items-center gap-2 mb-3">
                              <p class="text-5xl mb-0">{{card.data}}</p>
                              <i [class]="card.icon"></i>
                            </div>
                            <p class="text-gray-400">{{card.subtitle}}</p>
                          </div>
                          
                        </div>
                      }
                    </div>
    
                    <!-- dashboard 50% 50% -->
    
                      <div class="grid w-full ml-1">
    
                        <!-- grafico de barras -->
                        <div class="col p-0 pr-3 ">
                          <div class="bg-white shadow-1 px-4 py-2">
                            <p-chart type="bar" [data]="data" [options]="options" />
                          </div>
                        </div>
                      </div>
    
                  </section>
    
                </div>
              }
    
              @if (optionSelected === optionsSelect[1]) {
                <div class="col">
                  <div class="container-modal border-round p-4 mb-4">
                    <h2 class="mb-0 flex align-items-center gap-2"> {{optionSelected}}
                      <span class="text-sm">(horas libres)</span>  
                    </h2>
                  </div>
                  <app-preselection-schedule-view [schedule]="getFreeScheduleHoursBeca()" />
                </div>
              }
    
              @if (optionSelected === optionsSelect[2]) {
                <div class="col">
                  <div class="container-modal border-round p-4 mb-4">
                    <h2 class="mb-0 flex align-items-center gap-2"> {{optionSelected}}
                      <span class="text-sm">(Beca vs Ubicacion)</span>  
                    </h2>
                  </div>
                  <app-preselection-schedule-view [schedule]="getScheduleUbicationBeca()" />
                </div>
              }
            } @else {
              <div class="col">
                cargando informacion...
                <i class="pi pi-spin pi-spinner"></i>
              </div>
            }
          

        </section>

        </ng-template>
        
      

      </p-dialog>

    `,
    styles: `
    :host {
      display: block;
    }
    .badge{
      width: 8px;
      height: 8px;
    }

    .percentaje-title{
      font-size: 1rem;
    }

    .container-modal{
      background-color: #f2f4f5;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBecaPreselectionModalComponent implements Modal {

  /**
   * Propiedad que indica si el modal es visible o no.
   */
  @Input({required: true}) visible: boolean;

  /**
   * Emite un evento cuando el modal es cerrado.
   */
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  /**
   * Beca seleccionado a mostrar en el modal.
   */
  @Input() beca: BecaTrabajoByUbication;

  /**
   * Datos para mostrar en el gráfico de barras.
   */
  data: any;

  /**
   * Opciones de configuracion del grafico de barras.
   */
  options: any;

  /**
   * Estadisticas de seleccion del beca.
   */
  estadisticas : StatisticsUbication

  /**
   * Estado de consulta de las estadisticas. Usado para saber si se esta cargando la informacion.
   */
  statisticsState = signal({
    loading: true,
    error: false
  })

  /**
   * Opciones de seleccion para el modal.
   */
  optionsSelect = [
    'Estadisticas', 'Horario del beca', 'Horario de la ubicacion'
  ]

  /**
   * Opcion seleccionada.
   */
  optionSelected = 'Estadisticas'

  /**
   * Servicio de preseleccion.
   */
  preselectionService = inject(PreselectionService)


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.preselectionService.getStatisticsByBeca(this.beca.code).subscribe({
      next: (res: any) => {
        this.statisticsState.update(state => ({...state, loading: false}))
        this.estadisticas = res.data
        this.configBar()
      }
    })

  }

  configBar(){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
        labels: this.estadisticas.schedule_info.days,
        datasets: [
            {
                label: 'Porcentaje de horas cubiertas por dia',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: this.estadisticas.infoPerDay.map(item => item.percentageHoursCovered)
            },
            {
                label: 'Porcentaje de horas a cubrir por dia',
                backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                borderColor: documentStyle.getPropertyValue('--pink-500'),
                data: this.estadisticas.infoPerDay.map(item => 100)
            }
        ]
    };

    this.options = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
  }

  /**
   * Emite un evento para indicar que el componente está cerrado.
   */
  onClose() {
    this.visibleChange.emit(this.visible);
  };

  /**
   * Devuelve un array de objetos que representan datos estadísticos para mostrar en tarjetas.
   * @returns Un array de objetos con las siguientes propiedades:
   * - `title`: El título de la tarjeta.
   * - `data`: Los datos estadísticos.
   * - `subtitle`: El subtítulo de la tarjeta.
   * - `icon`: El icono a mostrar en la tarjeta.
   */
  getPercentagesCardData(){
    return [
      {
        title: 'Dias cubiertos',
        data: Number(this.estadisticas.percentageDaysCovered.toFixed(2)),
        subtitle: '% de dias cubiertos',
        icon: 'pi pi-calendar text-2xl'
      },
      {
        title: 'Total Horas cubiertas',
        data: this.estadisticas.totalHoursCovered,
        subtitle: `vs ${this.estadisticas.totalHoursToCover}h a cubrir`,
        icon: 'pi pi-clock text-2xl'
      },
      {
        title: 'Horas cubiertas',
        data: this.estadisticas.percentageHoursCovered,
        subtitle: `vs el 100% a cubrir`,
        icon: 'pi pi-percentage text-2xl'
      },
    ]
  }

  /**
   * Actualiza la opción seleccionada.
   * @param option La opción seleccionada.
   */
  onSelectOption(option: string){
    this.optionSelected = option
  }

  /**
   * Devuelve un objeto que representa el horario de horas libres de una beca.
   * @returns Un objeto con las siguientes propiedades:
   * - `day`: El día de la semana.
   * - `hours`: Las horas libres para ese día.
   */
  getFreeScheduleHoursBeca(): BecaSchedule {
    return {
      day: Object.keys(this.estadisticas.beca_schedule),
      hours: Object.values(this.estadisticas.beca_schedule)
    }
  }

  /**
   * Devuelve un objeto que representa la ubicación del horario de una beca.
   * @returns Un objeto con las siguientes propiedades:
   * - `day`: Dias de la semana que tiene el horario de la ubicacion asignados. .
   * - `coveredHours`: Las horas cubiertas por el beca para cada dia.
   * - `hoursToPerform`: Las horas a cubrir para cada dia.
   */
  getScheduleUbicationBeca(): InforPerDay{
    return {
      day: this.estadisticas.schedule_info.days,
      coveredHours: this.estadisticas.infoPerDay.map(item => item.coveredHours),
      hoursToPerform: this.estadisticas.infoPerDay.map(item => item.hoursToPerform)
    }
  }
}
