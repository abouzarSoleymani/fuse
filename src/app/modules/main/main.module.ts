import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';
import {CommonModule} from '@angular/common';
import {SharedModule} from 'app/shared/shared.module';
import {MainRoutingModule} from 'app/modules/main/main-routing.module';


@NgModule({
    imports     : [
        CommonModule,
        SharedModule,
        FuseSharedModule,
        MainRoutingModule
    ]
})
export class MainModule
{
}
