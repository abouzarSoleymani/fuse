import {NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {MapRoutingModule} from 'app/modules/main/map/map-routing.module';
import {MapComponent} from 'app/modules/main/map/map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {DriverDetailComponent} from 'app/modules/main/map/driver-detail/driver-detail.component';
import {DriverScoreComponent} from 'app/modules/main/map/driver-score/driver-score.component';

const I_MODULES = [
    MapRoutingModule,
    FuseSharedModule ,
    SharedModule,
    LeafletModule
];
const E_MODULES = [
    SharedModule,
    MapRoutingModule,
    DriverDetailComponent,
    DriverScoreComponent
];

const D_COMPONENTS: any = [
    MapComponent,
    DriverDetailComponent,
    DriverScoreComponent
];
const E_COMPONENTS: any = [
    DriverDetailComponent,
    DriverScoreComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: D_COMPONENTS,
    entryComponents: E_COMPONENTS,

})
export class MapModule {
}
