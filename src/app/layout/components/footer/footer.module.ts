import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FooterComponent } from 'app/layout/components/footer/footer.component';
import {SharedModule} from 'app/shared/shared.module';
import {DriverDetailComponent} from 'app/modules/main/map/driver-detail/driver-detail.component';

@NgModule({
    declarations: [
        FooterComponent,
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
        SharedModule
    ],
    exports     : [
        FooterComponent,
    ],
    entryComponents: []
})
export class FooterModule
{
}
