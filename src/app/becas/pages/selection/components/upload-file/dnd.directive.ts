import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Output,
} from '@angular/core';

@Directive({
    selector: '[DnD]',
    standalone: true,
})
export class DragDropDirective {
    @HostBinding('class.fileover') fileOver: boolean;
    @Output() fileDropped = new EventEmitter<any>();

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = true;
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        this.fileOver = false;
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(evt) {
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
                    invalidFiles.push(files[i]);
                }
            }
            if (invalidFiles.length === 0) {
                this.fileDropped.emit(files);
            } else {
                this.fileDropped.emit(false);
            }
        }
    }
}
