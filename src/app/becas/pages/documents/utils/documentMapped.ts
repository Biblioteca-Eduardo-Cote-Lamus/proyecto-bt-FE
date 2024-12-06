import { environment } from "src/environments/environment";

export const documentMapped = (document: any) => {
    return {
        id: document.id,
        name: document.name,
        description: document.description,
        file: `${environment.apiUrlBase}${document.file}`,
        dateCreated: document.date_created,
        size: document.size,
    };
}