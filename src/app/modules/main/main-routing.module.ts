import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from 'app/modules/main/main/main.component';

const routes: Routes = [
     { path: '', component: MainComponent , children: [
             { path: '', loadChildren: () => import('./map/map.module').then(m => m.MapModule )},
         ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
