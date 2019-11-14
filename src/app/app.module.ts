import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import {MatButtonModule, MatIconModule, MatProgressSpinnerModule} from '@angular/material';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { TranslateModule} from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import {SharedModule} from 'app/shared/shared.module';
import {environment} from '@env/environment';
import {AppRoutingModule} from 'app/app-routing.module';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from 'app/reducers';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {AuthGuard} from 'app/modules/authentication/auth.guard';
import {CustomSerializer} from 'app/shared/utils';
import {AuthenticationModule} from 'app/modules/authentication/authentication.module';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {HttpConfigInterceptor} from 'app/core/service/httpconfig.interceptor';
import {MainComponent} from 'app/modules/main/main/main.component';
import {FlexLayoutModule} from '@angular/flex-layout';

const D_COMPONENTS: any = [
    AppComponent,
];
const E_COMPONENTS: any = [
];

@NgModule({
    declarations:
        D_COMPONENTS,
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        SweetAlert2Module.forRoot(),
        TranslateModule.forRoot(),
        FlexLayoutModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,

        // App modules
        SharedModule,
        AuthenticationModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
        LeafletModule.forRoot(),
    ],
    entryComponents: E_COMPONENTS,

    providers: [AuthGuard,
        { provide: RouterStateSerializer, useClass: CustomSerializer },
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}


