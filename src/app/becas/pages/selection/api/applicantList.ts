export interface ApplicantListResponse {
    first_name:  string;
    last_name:   string;
    email:       string;
    photo:       null | string;
    sended_form: boolean;
}

export interface ApplicantList {
    fullName: string,
    email:       string;
    photo:       null | string;
    sendedForm: boolean;
}