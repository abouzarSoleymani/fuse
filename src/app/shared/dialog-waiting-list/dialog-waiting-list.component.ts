import { Component, OnInit } from '@angular/core';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {MatDialogRef} from '@angular/material';
import {ConfigRideLayoutService} from 'app/core/service/configRideLayout.service';
declare let L;

@Component({
  selector: 'dialog-waiting-list',
  templateUrl: './dialog-waiting-list.component.html',
  styleUrls: ['./dialog-waiting-list.component.scss']
})
export class DialogWaitingListComponent implements OnInit {

    description: string = 'دلایل لغو سفر';
    isLoading= false;
    waitTypes = [];
    reasonList;
    selectedOption;
  constructor(private errorDialog: ErrorDialogService,
              private dialogRef: MatDialogRef<DialogWaitingListComponent>,
              private rideOptionService: RideOptionService,
              private configRideLayout: ConfigRideLayoutService) { }

  ngOnInit() {
      this.getWaitTypesList();
      this.cancelReasonList();
  }
    getWaitTypesList(){
        this.isLoading = true;
        this.rideOptionService.getWaitTypeList().subscribe(
            (data) => {
                this.isLoading = false;
                this.waitTypes = data.data;
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            }
        );
    }

    cancelReasonList(){
        this.rideOptionService.getCancelResonList().subscribe(
            (data) => {
                  this.reasonList = data.data;
            }
        )
    }
    save() {
        this.rideOptionService.passengerCancelRide(this.selectedOption).subscribe(
            (data) => {
                /*    0:
                     eRateStatus: "UnRated"
                        eRequestStatus: "RequestTimeOut"
                        eRideRequestForm: "Online"
                        eRideStatus: "RequestTimeOut"*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');

            }
        )
        this.configRideLayout.changeLayoutRideOption(0);
        this.rideOptionService.resetRideOption();
        this.dialogRef.close();
    }
}
