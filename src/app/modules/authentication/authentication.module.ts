import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthenticationRoutingModule} from 'app/modules/authentication/authentication-routing.module';
import {StoreModule} from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import {AuthGuard} from 'app/modules/authentication/auth.guard';
import {AuthService} from 'app/modules/authentication/auth.service';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from 'app/modules/authentication/auth.effects';
import {SharedModule} from 'app/shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule,
    StoreModule.forFeature('auth', fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class AuthenticationModule {
/*    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthenticationModule,
            providers: [
                AuthService,
                AuthGuard
            ]
        }
    }*/
}
