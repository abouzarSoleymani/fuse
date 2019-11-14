import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {FooterDriverDetailComponent} from 'app/shared/footer-driver-detail/footer-driver-detail.component';

@NgModule({
    declarations: [
        FooterDriverDetailComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
        SharedModule
    ],
    exports     : [
        FooterDriverDetailComponent
    ]
})
export class FooterDriverDetailModule
{
}
