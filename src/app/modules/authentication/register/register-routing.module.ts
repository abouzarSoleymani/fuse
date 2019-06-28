import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {RegisterComponent} from 'app/modules/authentication/register/register.component';
import {VerifyCodeComponent} from 'app/modules/authentication/register/verify-code/verify-code.component';


const routes: Routes = [
    {
        path: '',
        component: RegisterComponent
    },
    {
        path: 'verify',
        component: VerifyCodeComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class RegisterRoutingModule {
}