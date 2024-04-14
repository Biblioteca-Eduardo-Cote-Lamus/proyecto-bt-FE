import { ApplicantList, ApplicantListResponse } from "../api";

export const mappedApplicantListResponse = (res: ApplicantListResponse[]): ApplicantList[] => {
    return res.map(({email, first_name,last_name, photo, sended_form}) => ({
        email,
        photo,
        sendedForm: sended_form,
        fullName: `${first_name} ${last_name}`
    }))
}