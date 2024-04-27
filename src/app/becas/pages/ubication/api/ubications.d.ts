export interface Ubication {
    id:                 number;
    name:               string;
    totalBecas:         number;
    manager:            Manager;
    isScheduleOffice:   boolean;
    schedule?:          string[];
    img:                string;
    description:        string;
}

export interface Manager {
    name: string;
    photo:  null;
}
