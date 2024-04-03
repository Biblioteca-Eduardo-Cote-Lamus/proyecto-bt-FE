import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// primeng imports
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Component({
    selector: 'app-selection',
    standalone: true,
    imports: [CommonModule, StepsModule, RouterOutlet],
    template: `
        <section class="pt-3 pr-5 lg:pl-5">
            <h1 class="text-2xl">Proceso de Selección</h1>
            <!-- stepper -->
            <div class="card">
                <p-steps [model]="items()" [readonly]="false" [activeIndex]="currentStep()"></p-steps>
            </div>
            <router-outlet></router-outlet>
        </section>
    `,
    styleUrl: './selection.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionComponent {
    items = signal<MenuItem[]>([]);
    currentStep = signal(0);

    constructor(private http: HttpClient, private router: Router) {}

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.items.set([
            {
                label: 'Cargar informe',
                routerLink: 'carge-informe',
            },
            {
                label: 'Preselección',
                routerLink: 'seat',
            },
            {
                label: 'Horario',
                routerLink: 'payment',
            },
            {
                label: 'Seleccionados',
                routerLink: 'confirmation',
            },
        ]);

        this.getCurrentStep().subscribe(({currentState}: any) => {
            const {id} = currentState;
            this.currentStep.set( id -1 );
            
            this.router.navigate([`/backoffice/becas/seleccion/${this.items()[this.currentStep()].routerLink}`]);

        });
        
    }

    getCurrentStep() {
        return this.http.get(`${environment.apiUrlBase}/selection/current-selection-state`)
    }
}

