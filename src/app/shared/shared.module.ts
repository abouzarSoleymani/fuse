import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RtlSupportDirective} from 'app/shared/rtl-support/rtl-support.directive';
import {HttpClientModule} from '@angular/common/http';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialModule} from 'app/shared/material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';




const I_MODULES = [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    MaterialModule,
    SweetAlert2Module

];
const E_MODULES = [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RtlSupportDirective,
    TranslateModule,
    MaterialModule,
    SweetAlert2Module
];

@NgModule({
    imports: I_MODULES,
    exports: E_MODULES,
    declarations: [RtlSupportDirective]
})
export class SharedModule {
}
