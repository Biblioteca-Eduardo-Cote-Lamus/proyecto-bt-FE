import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-ubication-managers',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>ubication-managers works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UbicationManagersComponent { }
