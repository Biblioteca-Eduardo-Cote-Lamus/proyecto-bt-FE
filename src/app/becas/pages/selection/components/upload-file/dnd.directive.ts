import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
} from '@angular/core';

export interface FileDropped {
    file?: File | File[] | null | undefined;
    valid: boolean;
}

@Directive({
    selector: '[DnD]',
    standalone: true,
})
export class DragDropDirective {
    @HostBinding('class.fileover') fileOver: boolean;
    @Input() isDraggable: boolean = true;
    @Output() fileDropped = new EventEmitter<FileDropped>();

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        if (this.isDraggable) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = true;
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        if (this.isDraggable) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
        if (this.isDraggable) {
            return;
        }
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
        let files = evt.dataTransfer.files;
        if (files.length > 0) {
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel',
            ];
            const invalidFiles = [];
            for (let i = 0; i < files.length; i++) {
                if (allowedTypes.indexOf(files[i].type) === -1) {
                    this.fileDropped.emit({ valid: false });
                    return;
                }
            }
            this.fileDropped.emit({
                file: files.length > 1 ? files : files[0],
                valid: true,
            })
        }
    }
}
