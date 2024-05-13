import { Routes } from "@angular/router";
import { UbicationsListComponent } from "./pages/ubications-list/ubications-list.component";
import { UbicationManagersComponent } from "./pages/ubication-managers/ubication-managers.component";

export const UBICATIONS_ROUTES: Routes = [
    {
        path: '',
        component: UbicationsListComponent
    },
    {
        path: 'encargados',
        component: UbicationManagersComponent
    }
]