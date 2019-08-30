import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { ContentComponent } from 'app/layout/components/content/content.component';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';

@NgModule({
    declarations: [
        ContentComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule
    ],
    exports     : [
        ContentComponent
    ]
})
export class ContentModule
{
}
