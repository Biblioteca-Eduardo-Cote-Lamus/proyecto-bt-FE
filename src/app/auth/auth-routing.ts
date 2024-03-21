import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { AccessComponent } from './access/access.component';

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'error',
        component: ErrorComponent,
    },
    {
        path: 'access',
        component: AccessComponent,
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
