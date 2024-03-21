import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuard } from './auth/guards/Auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: 'backoffice', component: AppLayoutComponent,
                children: [
                    
                ],
                canActivate: [authGuard]
            },
            { path: '', loadChildren: () => import('./auth/auth-routing').then(m => m.AUTH_ROUTES)},
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
