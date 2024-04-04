import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-beca-info',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>beca-info works!</p>`,
    styleUrl: './beca-info.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BecaInfoComponent { }
