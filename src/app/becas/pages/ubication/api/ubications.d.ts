export interface Ubication {
    id:          number;
    name:        string;
    totalBecas: number;
    manager:     Manager;
    schedule:    UbicationSchedule;
    img:         string;
    description: string;
}

export interface Manager {
    name:  string;
    photo: null;
}

export interface UbicationSchedule {
    scheduleType: string;
    schedule:     ScheduleElement[];
}

export interface ScheduleElement {
    days:  string[];
    hours: Hour[];
}

export interface Hour {
    start: string;
    end:   string;
    becas: any;
}
