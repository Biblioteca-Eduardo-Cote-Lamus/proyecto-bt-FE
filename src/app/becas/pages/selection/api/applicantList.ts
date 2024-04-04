export interface ApplicantListResponse {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    is_active: boolean,
    rol: {
        id: number,
        rol: string
    }
}

export interface ApplicantList {
    id: number,
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    rol: {
        id: number,
        rol: string
    }
}