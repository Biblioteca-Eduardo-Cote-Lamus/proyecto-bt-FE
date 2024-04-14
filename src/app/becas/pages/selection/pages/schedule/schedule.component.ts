import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-schedule',
    standalone: true,
    imports: [
        CommonModule,
    ],
    template: `<p>schedule works!</p>`,
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent { }
