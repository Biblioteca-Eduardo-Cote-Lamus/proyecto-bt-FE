import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
// primeng imports
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-selection',
    standalone: true,
    imports: [CommonModule, StepsModule, RouterOutlet],
    templateUrl: './selection.component.html',
    styleUrl: './selection.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionComponent {
    items = signal<MenuItem[]>([]);

    constructor() {}

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
    }
}

