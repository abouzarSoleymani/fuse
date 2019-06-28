import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
     { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
     { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)},
     { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
