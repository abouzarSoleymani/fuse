import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {AuthGuard} from 'app/modules/authentication/auth.guard';
import {AuthService} from 'app/modules/authentication/auth.service';
import {ForgotPasswordRoutingModule} from 'app/modules/authentication/forgot-password/forgot-password-routing.module';
import {ForgotPasswordComponent} from 'app/modules/authentication/forgot-password/forgot-password.component';

const I_MODULES = [
    ForgotPasswordRoutingModule,
    FuseSharedModule ,
    SharedModule
];
const E_MODULES = [
    SharedModule,
    ForgotPasswordRoutingModule
];

const COMPONENTS: any = [
    ForgotPasswordComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: COMPONENTS,
    providers: [AuthGuard, AuthService]
})
export class ForgotPasswordModule {
}
