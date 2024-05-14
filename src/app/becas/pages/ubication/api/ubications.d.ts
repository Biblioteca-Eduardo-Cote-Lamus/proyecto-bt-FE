export interface Ubication {
    id:          number;
    name:        string;
    totalBecas:  number;
    manager:     ManagerUbication;
    schedule:    UbicationSchedule;
    img:         string;
    description: string;
}

export interface ManagerUbication {
    name:  string;
    photo: null;
}

export interface UbicationSchedule {
    scheduleType:    string;
    schedule:        ScheduleElement[];
    scheduleFormat: Array<string[]>;
}

export interface ScheduleElement {
    days:  string[];
    hours: Hour[];
}

export interface Hour {
    start: string;
    end:   string;
    becas: number;
}
