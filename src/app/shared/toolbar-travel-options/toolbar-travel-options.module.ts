import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import {SharedModule} from 'app/shared/shared.module';
import {ToolbarTravelOptionsComponent} from 'app/shared/toolbar-travel-options/toolbar-travel-options.component';

@NgModule({
    declarations: [
        ToolbarTravelOptionsComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
        SharedModule
    ],
    exports     : [
        ToolbarTravelOptionsComponent
    ]
})
export class ToolbarTravelOptionsModule
{
}
