import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {BodyWaitingNearDriverComponent} from 'app/shared/body-waiting-near-driver/body-waiting-near-driver.component';

@NgModule({
    declarations: [
        BodyWaitingNearDriverComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
        SharedModule
    ],
    exports     : [
        BodyWaitingNearDriverComponent
    ]
})
export class BodyWaitingNearDriverModule
{
}
