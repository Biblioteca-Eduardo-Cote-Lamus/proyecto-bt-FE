import { Directive, HostListener, HostBinding, Output, EventEmitter, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDragdrop]',
  standalone: true,
})
export class DrapdropDirective {

  @Output() fileDropped = new EventEmitter<FileList>();

  constructor(private el: ElementRef) {}

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.el.nativeElement.classList.add('drag-over');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.el.nativeElement.classList.remove('drag-over');
  }

  @HostListener('drop', ['$event']) onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.el.nativeElement.classList.remove('drag-over');
    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }


}
