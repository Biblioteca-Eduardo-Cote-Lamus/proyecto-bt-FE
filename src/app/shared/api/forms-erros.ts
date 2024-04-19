export interface FormErros {
    errorsByControl: (control: string) => string[],
    errorByControl: (control: string) => boolean
}