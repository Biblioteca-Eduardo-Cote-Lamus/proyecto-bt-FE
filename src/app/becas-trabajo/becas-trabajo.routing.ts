import { Routes } from "@angular/router";
import { RegisterFormComponent } from "./pages/register-form/register-form.component";
import { registerFormGuard } from "./guards/register-form.guard";

export const BECAS_TRABAJO_ROUTES: Routes = [
    {
        path: 'registro',
        component: RegisterFormComponent,
        canActivate: [registerFormGuard]
    },
    {
        path: '**',
        redirectTo: 'registro'
    }
]