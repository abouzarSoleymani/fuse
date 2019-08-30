import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {MainRoutingModule} from 'app/modules/main/main-routing.module';
import {LayoutModule} from 'app/layout/layout.module';
import { MainComponent } from './main/main.component';
import {FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '@fuse/components';
import {HttpClientModule} from '@angular/common/http';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {AuthenticationModule} from 'app/modules/authentication/authentication.module';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from 'app/reducers';
import {environment} from '@env/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {AuthGuard} from 'app/modules/authentication/auth.guard';

const D_COMPONENTS: any = [
    MainComponent,
];
const E_COMPONENTS: any = [
];

@NgModule({
    imports     : [
        CommonModule,
        SharedModule,
        FuseSharedModule,
        MainRoutingModule,
        LayoutModule,
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        HttpClientModule,
        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,



        // App modules
        AuthenticationModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([]),

    ],
    providers: [AuthGuard],
    declarations: D_COMPONENTS,
    entryComponents: E_COMPONENTS,

})
export class MainModule
{
}
