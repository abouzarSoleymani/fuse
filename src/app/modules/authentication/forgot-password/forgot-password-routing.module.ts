import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ForgotPasswordComponent} from 'app/modules/authentication/forgot-password/forgot-password.component';


const routes: Routes = [
    {
        path: '',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class ForgotPasswordRoutingModule {
}