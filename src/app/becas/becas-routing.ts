import { Routes } from "@angular/router"
import { SelectionComponent } from "./pages/selection/selection.component"

export const BECAS_ROUTES: Routes = [
    {
        path: 'seleccion',
        component: SelectionComponent,
        loadChildren: () => import('./pages/selection/selection-routing').then(s => s.SELECTION_ROUTES)
    },
    {
        path: 'ubicaciones',
        loadChildren: () => import('./pages/ubication/ubications.routes').then(u => u.UBICATIONS_ROUTES)
    }
]