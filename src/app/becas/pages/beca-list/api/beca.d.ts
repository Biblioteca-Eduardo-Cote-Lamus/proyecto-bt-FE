export interface BecaTrabajo {
    beca:     Beca;
    schedule: Schedule;
}

export interface Beca {
    id:        number;
    name:      string;
    lastName:  string;
    photo:     string;
    ubication: Ubication;
}

export interface Ubication {
    id:   number;
    name: string;
}

export interface Schedule {
    lunes:     Lune[];
    martes:    Lune[];
    miercoles: Lune[];
    jueves:    any[];
    viernes:   Lune[];
    sabado:    Lune[];
}

export interface Lune {
    start: string;
    end:   string;
}
