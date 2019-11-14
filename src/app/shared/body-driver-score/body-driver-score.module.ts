import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {BodyDriverScoreComponent} from 'app/shared/body-driver-score/body-driver-score.component';

@NgModule({
    declarations: [
        BodyDriverScoreComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
        SharedModule
    ],
    exports     : [
        BodyDriverScoreComponent
    ]
})
export class BodyDriverScoreModule
{
}
