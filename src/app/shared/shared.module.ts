import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RtlSupportDirective} from 'app/shared/rtl-support/rtl-support.directive';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from 'app/shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {MatProgressSpinnerModule} from '@angular/material';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ContentModule} from 'app/layout/components/content/content.module';
import { DialogElementsExampleDialogComponent } from './dialog-elements-example-dialog/dialog-elements-example-dialog.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { PassengerReasonsComponent } from './passenger-reasons/passenger-reasons.component';
import { TravelOptionsComponent } from './travel-options/travel-options.component';
import { ToolbarTravelOptionsComponent } from './toolbar-travel-options/toolbar-travel-options.component';




// @ts-ignore
const I_MODULES = [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    MaterialModule,
    SweetAlert2Module,
    SwiperModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    ContentModule


];
const E_MODULES = [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RtlSupportDirective,
    TranslateModule,
    MaterialModule,
    SweetAlert2Module,
    SwiperModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    ContentModule,
    StarRatingComponent,
    PassengerReasonsComponent,
    TravelOptionsComponent,
    ToolbarTravelOptionsComponent
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    entryComponents: [DialogElementsExampleDialogComponent, StarRatingComponent, PassengerReasonsComponent, TravelOptionsComponent,ToolbarTravelOptionsComponent],
    declarations: [RtlSupportDirective, DialogElementsExampleDialogComponent, StarRatingComponent, RadioButtonComponent, RadioGroupComponent, PassengerReasonsComponent, TravelOptionsComponent, ToolbarTravelOptionsComponent]
})
export class SharedModule {
}
