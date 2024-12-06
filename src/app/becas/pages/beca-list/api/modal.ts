import { EventEmitter } from "@angular/core";

export interface ModalSchedule {
    onCancel: EventEmitter<boolean>;
    cancel: () => void;
}