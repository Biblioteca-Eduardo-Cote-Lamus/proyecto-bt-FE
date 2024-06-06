import { Routes } from "@angular/router";
import { PreselectionTabViewComponent } from "./pages/preselection-tab-view/preselection-tab-view.component";
import { SeleccionarTabViewComponent } from "./pages/seleccionar-tab-view/seleccionar-tab-view.component";

export const PRESELECCTION_ROUTES: Routes = [
    // {
    //     path: '',
    //     component: PreselectionTabViewComponent
    // },
    {
        path: 'notificar',
        component: SeleccionarTabViewComponent
    },
    {
        path: '**',
        redirectTo: 'notificar'
    }
]