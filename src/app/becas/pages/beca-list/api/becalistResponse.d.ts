import { UbicationName } from "../../ubication";
import { Schedule } from "./beca";

export interface BecaTrabajoListResponse {
    beca:     BecaResponse;
    schedule: Schedule;
}

export interface BecaResponse {
    id:        number;
    name:      string;
    last_name: string;
    photo:     string;
    ubication: UbicationName;
}


