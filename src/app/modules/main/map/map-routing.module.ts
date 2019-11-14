import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainMapComponent} from 'app/modules/main/map/main-map/main-map.component';
import {MapComponent} from 'app/modules/main/map/map/map.component';


const routes: Routes = [
    { path: '', component: MainMapComponent , children: [
            { path: '',  component: MapComponent},
        ]
    }
  ];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class MapRoutingModule {
}