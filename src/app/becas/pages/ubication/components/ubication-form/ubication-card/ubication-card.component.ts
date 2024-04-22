import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ScheduleViewComponent } from 'src/app/components/schedule-view/schedule-view.component';
import { ScheduleService } from 'src/app/components/schedule-view/schedule.service';

interface UbicationCardInput {
    ubication:    string;
    manager:      any;
    becas:        string;
    description:  string;
    schedule:    string[];
    photo:        string | null;
    typeSchedule: string
}


@Component({
    selector: 'app-ubication-card',
    standalone: true,
    imports: [ButtonModule, OverlayPanelModule,ScheduleViewComponent],
    template: `
        <div class="profile-header surface-200 border-round-top h-20rem">
            @if (ubicationFormValue && ubicationFormValue['photo']) { 
                <img
                src="{{ ubicationFormValue['photo'] }}"
                    alt="imagen de la ubicacion"
                    class="w-full h-full object-cover"
                />
            }
        </div>
        <div>
            <div class="flex justify-content-center m w-12rem mx-auto  relative" >
                <img
                    src="assets/shared/no-user.svg"
                    alt=""
                    class="border-circle bg-white p-2 w-full "
                />
            </div>
            <div class="p-3 ">
                <ul class="p-0 list-none">
                    <li class="mb-2">
                        Ubicacion:
                        {{
                            ubicationFormValue ? ubicationFormValue['ubication'] : 'Sin asignar'
                        }}
                    </li>
                    <li class="mb-2">
                        Encargado:
                        {{
                            ubicationFormValue ? ubicationFormValue['manager'].fullName : 'Sin asginar'
                        }}
                    </li>
                    <li class="mb-2">
                        Becas asignados:
                        {{ ubicationFormValue ? ubicationFormValue['becas'] : 'Sin asignar' }}
                    </li>
                </ul>
                <p class="">
                    {{
                        ubicationFormValue ? ubicationFormValue['description'] : 'Sin descripcion'
                    }}
                </p>
                @if (ubicationFormValue && ubicationFormValue['typeSchedule']) {
                    <div class="flex justify-content-center">
                        <p-button
                            label="ver horario"
                            icon="pi pi-eye"
                            iconPos="right"
                            (click)="op.toggle($event)"
                        >
                        <p-overlayPanel #op>
                            <app-schedule-view  />
                        </p-overlayPanel>
                        </p-button>
                    </div>
                }
            </div>
        </div>
    `,
    styles: `
        .m{
            margin-top: -100px;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationCardComponent implements OnChanges{

    @Input({required: true}) ubicationFormValue: UbicationCardInput 

    constructor(
        private scheduleService: ScheduleService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        const {currentValue} = changes['ubicationFormValue']

        if(currentValue){
            this.scheduleService.scheduleList = currentValue.schedule
        }
    }

}
