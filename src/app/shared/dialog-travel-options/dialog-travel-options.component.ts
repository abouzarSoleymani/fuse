import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {Ride} from 'app/modules/authentication/ride.actions';
import {LocalStorageService} from 'app/core/service/local-storage.service';

@Component({
  selector: 'dialog-travel-options',
  templateUrl: './dialog-travel-options.component.html',
  styleUrls: ['./dialog-travel-options.component.scss']
})
export class DialogTravelOptionsComponent implements OnInit {

    color = 'accent';
    disabled = false;
    form: FormGroup;
    secondDestination = false;
    description: string = 'گزینه های سفر';
    isLoading = false;
    waitTypes = [];
    roundTrip = false;
    price;
    constructor(
        private formBuilder: FormBuilder,
        private rideOptionService: RideOptionService,
        private dialogRef: MatDialogRef<DialogTravelOptionsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private errorDialog: ErrorDialogService,
        private localStorage: LocalStorageService
    ) {

    }

    ngOnInit() {
        this.secondDestination = this.rideOptionService.checkSecondDestination();
        this.roundTrip = this.rideOptionService.checkRoundTrip();
         this.form = this.formBuilder.group({
             description: [''],
        });
       // this.description = this.data.description;
        this.rideOptionService.getFareAmount().subscribe(
            (data) => {
                this.price = data;
            }
        )
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
    getWaitTypesList(){
        this.isLoading = true;
        console.log('inja')
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
    selectedWaitList(event){
        this.localStorage.updateItem('ride', {vWaitType: event.value.WaitTypeId })
        this.rideOptionService.getPassengerEstimateFare();
    }

    setSecondDestination(){
        this.secondDestination = !this.secondDestination;
        console.log(this.secondDestination)
        this.rideOptionService.secondDestination(this.secondDestination);
        this.close();
    }
    changeRoundTrip(event){
        console.log(event.checked)
        this.roundTrip = event.checked;
        this.localStorage.updateItem('ride', {vSweep: this.roundTrip})
        this.rideOptionService.getPassengerEstimateFare();
    }
}
