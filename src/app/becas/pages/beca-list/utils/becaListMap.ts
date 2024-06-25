import { environment } from "src/environments/environment";
import { BecaTrabajo, BecaTrabajoListResponse } from "../api"

export const BecaTrabajoResMap = (becaRes: BecaTrabajoListResponse): BecaTrabajo => {
    const { id, last_name, name, ubication, photo} = becaRes.beca;
    const {schedule} = becaRes
    return {
        beca: {
            id,
            lastName: last_name,
            name,
            photo:`${environment.apiUrlBase}${photo}`,
            ubication
        },
        schedule
    }
}