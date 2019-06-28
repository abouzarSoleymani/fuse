import {NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {MapRoutingModule} from 'app/modules/main/map/map-routing.module';
import {MapComponent} from 'app/modules/main/map/map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';

const I_MODULES = [
    MapRoutingModule,
    FuseSharedModule ,
    SharedModule,
    LeafletModule
];
const E_MODULES = [
    SharedModule,
    MapRoutingModule
];

const COMPONENTS: any = [
    MapComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: COMPONENTS,
})
export class MapModule {
}
