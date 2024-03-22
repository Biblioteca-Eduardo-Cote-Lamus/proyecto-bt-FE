import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UploadFileComponent } from '../../components/upload-file/upload-file.component';

@Component({
    selector: 'app-selection',
    standalone: true,
    imports: [
        CommonModule, UploadFileComponent
    ],
    template: `<app-upload-file />`,
    styleUrl: './selection.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionComponent { }
