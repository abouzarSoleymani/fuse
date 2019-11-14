import {NgModule} from '@angular/core';
import {FuseSharedModule} from '@fuse/shared.module';
import {SharedModule} from 'app/shared/shared.module';
import {MapRoutingModule} from 'app/modules/main/map/map-routing.module';
import {MapComponent} from 'app/modules/main/map/map/map.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {BodyDriverScoreComponent} from 'app/shared/body-driver-score/body-driver-score.component';
import {MainMapComponent} from 'app/modules/main/map/main-map/main-map.component';
import {ToolbarTravelOptionsModule} from 'app/shared/toolbar-travel-options/toolbar-travel-options.module';
import {ContentModule} from 'app/layout/components/content/content.module';
import {FooterDriverOptionsModule} from 'app/shared/footer-driver-options/footer-driver-options.module';
import {FooterDriverDetailModule} from 'app/shared/footer-driver-detail/footer-driver-detail.module';
import {BodyWaitingNearDriverModule} from 'app/shared/body-waiting-near-driver/body-waiting-near-driver.module';
import {BodyDriverScoreModule} from 'app/shared/body-driver-score/body-driver-score.module';

const I_MODULES = [
    MapRoutingModule,
    FuseSharedModule ,
    SharedModule,
    LeafletModule,
    ToolbarTravelOptionsModule,
    FooterDriverOptionsModule,
    FooterDriverDetailModule,
    BodyWaitingNearDriverModule,
    BodyDriverScoreModule,
    ContentModule,
];
const E_MODULES = [
    SharedModule,
    MapRoutingModule,
    MainMapComponent,
];

const D_COMPONENTS: any = [
    MapComponent,
    MainMapComponent
];
const E_COMPONENTS: any = [
    BodyDriverScoreComponent,
    MainMapComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: D_COMPONENTS,
    entryComponents: E_COMPONENTS,

})
export class MapModule {
}
