export interface Ubication {
    id:                 number;
    name:               string;
    totalBecas:         number;
    manager:            Manager;
    isScheduleOffice:   boolean;
    schedule?:          string[];
}

export interface Manager {
    name: string;
    photo:  null;
}
