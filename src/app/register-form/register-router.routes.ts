import { Routes } from "@angular/router";
import { RegisterFormComponent } from "./register-form.component";
import { ClosedFormComponent } from "./pages/close-form/close-form.component";
import { SendedFormComponent } from "./pages/sended-form/sended-form.component";
import { leaveRegisterFormGuard, registerFormGuard } from "./guards";

export const REGISTER_FORM_ROUTES : Routes = [
    {
        path: 'formulario-registro',
        component: RegisterFormComponent,
        canActivate: [registerFormGuard],
        canDeactivate:[leaveRegisterFormGuard]
    },
    {
        path: 'formulario-enviado',
        component: SendedFormComponent,
    },
    {
        path: 'formulario-cerrado',
        component: ClosedFormComponent
    },
    {
        path: '**',
        redirectTo: 'formulario-registro',
        pathMatch: 'full'
    }
    
]