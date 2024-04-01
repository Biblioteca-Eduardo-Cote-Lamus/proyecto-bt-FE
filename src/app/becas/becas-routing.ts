import { Routes } from "@angular/router"
import { SelectionComponent } from "./pages/selection/selection.component"

export const BECAS_ROUTES: Routes = [
    {
        path: 'seleccion',
        component: SelectionComponent,
        loadChildren: () => import('./pages/selection/selection-routing').then(s => s.SELECTION_ROUTES)
    }
]