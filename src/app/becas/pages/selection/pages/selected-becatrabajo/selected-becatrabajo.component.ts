import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-selected-becatrabajo',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>selected-becatrabajo works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedBecatrabajoComponent { }
