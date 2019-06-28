import {ModuleWithProviders, NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';
import {LoginRoutingModule} from 'app/modules/authentication/login/login-routing.module';
import {SharedModule} from 'app/shared/shared.module';
import {LoginComponent} from 'app/modules/authentication/login/login.component';
import {AuthService} from 'app/modules/authentication/auth.service';
import {AuthGuard} from 'app/modules/authentication/auth.guard';

const I_MODULES = [
    LoginRoutingModule,
    FuseSharedModule ,
    SharedModule
];
const E_MODULES = [
    SharedModule,
    LoginRoutingModule
];

const COMPONENTS: any = [
    LoginComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: COMPONENTS,
    providers: [AuthGuard, AuthService]
})
export class LoginModule {
}
