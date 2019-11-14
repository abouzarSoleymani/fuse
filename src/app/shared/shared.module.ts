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
import { DialogWaitingListComponent } from './dialog-waiting-list/dialog-waiting-list.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { RadioGroupComponent } from './radio-group/radio-group.component';
import { PassengerReasonsComponent } from './passenger-reasons/passenger-reasons.component';
import { DialogTravelOptionsComponent } from './dialog-travel-options/dialog-travel-options.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { DialogVoucherCodeInputComponent } from './dialog-voucher-code-input/dialog-voucher-code-input.component';
import { IranianPlateComponent } from './iranian-plate/iranian-plate.component';
import { CallSupportReasonsComponent } from './call-support-reasons/call-support-reasons.component';




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
    ContentModule,
    FlexLayoutModule


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
    DialogTravelOptionsComponent,
    DialogVoucherCodeInputComponent,
    IranianPlateComponent,
    CallSupportReasonsComponent


];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    entryComponents: [DialogWaitingListComponent, StarRatingComponent, PassengerReasonsComponent, DialogTravelOptionsComponent, DialogVoucherCodeInputComponent, IranianPlateComponent, CallSupportReasonsComponent],
    declarations: [RtlSupportDirective, DialogWaitingListComponent, StarRatingComponent, RadioButtonComponent, RadioGroupComponent, PassengerReasonsComponent, DialogTravelOptionsComponent, DialogVoucherCodeInputComponent, IranianPlateComponent, CallSupportReasonsComponent, ]
})
export class SharedModule {
}
