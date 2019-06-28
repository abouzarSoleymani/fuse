import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from 'app/modules/authentication/auth.guard';


const appRoutes: Routes = [

    { path: 'main', loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule), canActivate: [AuthGuard]},
    { path: 'auth', loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule)},
    {
        path      : '**',
        redirectTo: 'main'
    }
];

export const AppRoutingModule = RouterModule.forRoot(appRoutes);
