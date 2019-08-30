import { Component, OnInit } from '@angular/core';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-dialog-elements-example-dialog',
  templateUrl: './dialog-elements-example-dialog.component.html',
  styleUrls: ['./dialog-elements-example-dialog.component.scss']
})
export class DialogElementsExampleDialogComponent implements OnInit {
    isLoading= false;
    waitTypes = [];
    reasonList;
    selectedOption;
  constructor(private errorDialog: ErrorDialogService,
              private dialogRef: MatDialogRef<DialogElementsExampleDialogComponent>,
              private rideOptionService: RideOptionService) { }

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
                /*  0:
                    WaitTypeId: 1
                    vDesc: ""
                    vPrice: 5
                    vTitle: "۲ تا ۵ دقیقه"*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            }
        );
    }
    setCancelResons(selectedOption){
        this.rideOptionService.passengerCancelRide(selectedOption).subscribe(
            (data) => {
                /*    0:
                     eRateStatus: "UnRated"
                        eRequestStatus: "RequestTimeOut"
                        eRideRequestForm: "Online"
                        eRideStatus: "RequestTimeOut"*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');

            }
        )
      this.dialogRef.close(DialogElementsExampleDialogComponent);
      this.rideOptionService.emmitWaiting.next(false);
      this.rideOptionService.resetRideOption();
    }

    cancelReasonList(){
        this.rideOptionService.getCancelResonList().subscribe(
            (data) => {
                this.reasonList = data.data;
            }
        )
    }
}
