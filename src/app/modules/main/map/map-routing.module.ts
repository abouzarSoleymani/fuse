import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MapComponent} from 'app/modules/main/map/map.component';


const routes: Routes = [
    {
        path: '',
        component: MapComponent
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class MapRoutingModule {
}