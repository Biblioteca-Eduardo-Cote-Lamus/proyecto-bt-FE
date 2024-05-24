export interface StatisticsUbication {
    percentageDaysCovered:  number;
    preselected:            boolean;
    totalFullDays:          number;
    coveredDays:            string[];
    infoPerDay:             InfoPerDay[];
    totalHoursToCover:      number;
    totalHoursCovered:      number;
    percentageHoursCovered: number;
    beca:                   null;
    schedule_info:          ScheduleInfo;
    beca_schedule:          BecaSchedule;
}

export interface BecaSchedule {
    lunes:     string[];
    martes:    string[];
    miercoles: string[];
    jueves:    string[];
    viernes:   string[];
    sabado:    string[];
}

export interface InfoPerDay {
    day:                    string;
    allHoursCovered:        boolean;
    coveredHours:           string[];
    hoursToPerform:         string[];
    percentageHoursCovered: number;
}

export interface ScheduleInfo {
    days:  string[];
    hours: Hour[];
}

export interface Hour {
    start: string;
    end:   string;
}
