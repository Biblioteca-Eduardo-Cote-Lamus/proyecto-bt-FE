import { ApplicantList, ApplicantListResponse } from "../api";

export const mappedApplicantListResponse = (res: ApplicantListResponse[]): ApplicantList[] => {
    return res.map(({email, first_name, id, is_active, last_name, rol}) => ({
        email,
        firstName: first_name,
        id,
        isActive: is_active,
        lastName: last_name,
        rol
    }))
}