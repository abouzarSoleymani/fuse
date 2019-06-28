import {NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {AuthService} from 'app/modules/authentication/auth.service';
import {RegisterComponent} from 'app/modules/authentication/register/register.component';
import {RegisterRoutingModule} from 'app/modules/authentication/register/register-routing.module';
import {VerifyCodeComponent} from 'app/modules/authentication/register/verify-code/verify-code.component';

const I_MODULES = [
    RegisterRoutingModule,
    FuseSharedModule ,
    SharedModule
];
const E_MODULES = [
    SharedModule,
    RegisterRoutingModule
];

const COMPONENTS: any = [
    RegisterComponent,
    VerifyCodeComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: COMPONENTS,
    providers: [AuthService]
})
export class RegisterModule {
}
