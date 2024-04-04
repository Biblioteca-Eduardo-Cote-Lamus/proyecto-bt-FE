import { Routes } from "@angular/router";
import { ReportComponent } from "./pages/report/report.component";
import { BecaInfoComponent } from "./pages/beca-info/beca-info.component";

export const SELECTION_ROUTES: Routes = [ 
    {
        path: 'carge-informe',
        component: ReportComponent
    },
    {
        path: 'beca-informacion',
        component: BecaInfoComponent
    },

]