import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {Ride} from 'app/modules/authentication/ride.actions';

@Component({
  selector: 'app-travel-options',
  templateUrl: './travel-options.component.html',
  styleUrls: ['./travel-options.component.scss']
})
export class TravelOptionsComponent implements OnInit {

    color = 'accent';
    checked = false;
    disabled = false;
    form: FormGroup;
    secondDestination = false;
    description: string = 'گزینه های سفر';
    isLoading = false;
    waitTypes = [];


    constructor(
        private formBuilder: FormBuilder,
        private rideOptionService: RideOptionService,
        private dialogRef: MatDialogRef<TravelOptionsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private errorDialog: ErrorDialogService,
    ) {

    }

    ngOnInit() {

         this.form = this.formBuilder.group({
             description: [''],
        });
       // this.description = this.data.description;

    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
    getWaitTypesList(){
        this.isLoading = true;
        this.rideOptionService.getWaitTypeList().subscribe(
            (data) => {
                this.isLoading = false;
                this.waitTypes = data.data;
                /*  0:
                    WaitTypeId: 1
                    vDesc: ""
                    vPrice: 5
                    vTitle: "۲ تا ۵ دقیقه"*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            }
        );
    }
}
