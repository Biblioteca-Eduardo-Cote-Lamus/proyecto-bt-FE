import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-preselection',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>preselection works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreselectionComponent { }
