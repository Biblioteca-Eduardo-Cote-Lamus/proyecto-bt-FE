import { Manager } from "../api"

export const managersMap = (response: any): Manager => {
    return {
        id: response.id,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        isActive: response.is_active,
        rol: response.rol
    }
}