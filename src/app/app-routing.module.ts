import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuard } from './auth/guards/Auth.guard';
import { RegisterFormComponent } from './register-form/register-form.component';
import { leaveRegisterFormGuard, registerFormGuard } from './register-form/guards';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'backoffice', component: AppLayoutComponent,
                children: [
                    {
                        path: 'becas',
                        loadChildren: () => import('./becas/becas-routing').then(m => m.BECAS_ROUTES)
                    },
                    {
                        path: 'becas-trabajo', 
                        loadChildren: () => import('./becas-trabajo/becas-trabajo.routing').then(m => m.BECAS_TRABAJO_ROUTES)
                    }
                ],
                canActivate: [authGuard]
            },
            { path: '', loadChildren: () => import('./auth/auth-routing').then(m => m.AUTH_ROUTES)},
            { path: 'notfound', component: NotfoundComponent },
            { 
                path: 'registro-beca', 
                loadChildren: () => import('./register-form/register-router.routes').then(r => r.REGISTER_FORM_ROUTES),
                canActivate: [authGuard]
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
