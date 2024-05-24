import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { EscarapelaComponent } from 'src/app/components/escarapela/escarapela.component';
import { BecaTrabajoByUbication, Modal } from 'src/app/shared/api';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-info-beca-preselection-modal',
    standalone: true,
    imports: [
        DialogModule,
        EscarapelaComponent,
        ChartModule,
        NgClass
    ],
    template: `
      <p-dialog 
        header="Header" 
        [(visible)]="visible" 
        [modal]="true" 
        [style]="{ width: '95vw', boxShadow: 'none', overflowY: 'auto', overflowX: 'hidden' }" 
        [draggable]="false" 
        [resizable]="false"
        maskStyle="backdrop-filter: blur(2px);">

        <ng-template pTemplate="headless">
          
        <!-- contenedor general -->
        <section class="grid mr-3">

          <!-- escarapela container -->
            <div class="col-3 ">

              <div class="">
                  <app-escarapela [beca]="beca" />
                  <!-- opciones extras -->
                  <div>
                    <button>hola</button>
                  </div>
              </div>

            </div>

          <!-- Dashboard container -->
            <div class="col ml-4">

              <!-- dashboard -->
              <section class="">
              
                <!-- porcentajes -->
                <div class="flex w-full gap-3  mb-5 ">
                  @for (card of porcentaje; track $index) {
                    <div class="text-center w-full bg-white py-3 shadow-1 border-round">
                      <div class="flex justify-content-center align-items-center gap-2">
                        <i class="pi pi-percentage"></i>
                        <p class="text-xl">{{card.data}}</p>
                      </div>
                      <p class="percentaje-title">{{card.title}}</p>
                    </div>
                  }
                </div>

                <!-- dashboard 50% 50% -->

                  <div class="grid w-full ml-1">

                    <!-- grafico de barras -->
                    <div class="col-6 p-0 pr-3 ">
                      <div class="bg-white px-4 py-2">
                        <p-chart type="bar" [data]="data" [options]="options" />
                      </div>
                    </div>
                    <!-- pie -->
                    <div class="col-6 p-0">
                      <div class="bg-white px-4 py-2">
                        <p-chart type="pie" [data]="data" [options]="options" />
                      </div>
                    </div>

                  </div>

              </section>

            </div>

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
      font-size: 0.7rem;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoBecaPreselectionModalComponent implements Modal {
  @Input({required: true}) visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter();

  @Input() beca: BecaTrabajoByUbication;

  porcentaje = [
    {
      title: 'Porcentaje de becas preseleccionadas',
      data: 10,
    },
    {
      title: 'Porcentaje de becas preseleccionadas',
      data: 10,
    },
    {
      title: 'Porcentaje de becas preseleccionadas',
      data: 10,
    },
    {
      title: 'Porcentaje de becas preseleccionadas',
      data: 10,
    },
  ]

  data: any;

  options: any;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                borderColor: documentStyle.getPropertyValue('--pink-500'),
                data: [28, 48, 40, 19, 86, 27, 90]
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


  onClose() {
    this.visibleChange.emit(this.visible);
  };

}
