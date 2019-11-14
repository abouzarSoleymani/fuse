import { NgModule } from '@angular/core';
import { FooterDriverOptionsComponent } from './footer-driver-options.component';
import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';

@NgModule({
    declarations: [
        FooterDriverOptionsComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
        SharedModule
    ],
    exports     : [
        FooterDriverOptionsComponent
    ]
})
export class FooterDriverOptionsModule
{
}
