import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatSlideToggleModule,
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSnackBarModule,
        MatTableModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSlideToggleModule,

    ],
    exports: [
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSnackBarModule,
        MatTableModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatSlideToggleModule,

    ]
})
export class MaterialModule {
}