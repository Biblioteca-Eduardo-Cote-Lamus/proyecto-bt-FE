import { EventEmitter } from "@angular/core"

export interface Modal {
    visible: boolean ,
    visibleChange: EventEmitter<boolean>
    onClose: Function
}