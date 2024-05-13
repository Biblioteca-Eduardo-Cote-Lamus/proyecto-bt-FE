import { Routes } from "@angular/router";
import { ReportComponent } from "./pages/report/report.component";
import { BecaInfoComponent } from "./pages/beca-info/beca-info.component";
import { PreselectionComponent } from "./pages/preselection/preselection.component";
import { ScheduleComponent } from "./pages/schedule/schedule.component";
import { SelectedBecatrabajoComponent } from "./pages/selected-becatrabajo/selected-becatrabajo.component";


export const SELECTION_ROUTES: Routes = [ 
    {
        path: 'carge-informe',
        component: ReportComponent
    },
    {
        path: 'beca-informacion',
        component: BecaInfoComponent
    },
    {
        path: 'preseleccion',
        loadChildren: () => import('./pages/preselection/preselection.routes').then(p => p.PRESELECCTION_ROUTES),
        component: PreselectionComponent
    },
    {
        path: 'horario',
        component: ScheduleComponent
    },
    {
        path: 'seleccionados',
        component: SelectedBecatrabajoComponent
    },

]