import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {DialogsService} from 'app/layout/components/footer/dialogs.service';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './driver-detail.component.html',
  styleUrls: ['./driver-detail.component.scss']
})
export class DriverDetailComponent implements OnInit {
   rideDetails;
  constructor(private rideOptions: RideOptionService,
              private cdRef: ChangeDetectorRef,
              private dialogsService: DialogsService) { }

  ngOnInit() {
      if(this.rideDetails == null){
          this.rideOptions.getPassengerRideDetail().subscribe(
              (data) => {
                  this.rideDetails = data.data[0];
              }
          )
      }
  }
    travelOptions(){
      this.dialogsService.openDialogTravelOptions();
    }
    checkVoucher(){
        this.dialogsService.openDialogTravelOptions();
    }
    payOnline(){
      console.log('payOnline');
    }
    callWithDriver(phone){
         console.log('callwithDriver');
        document.location.href="tel:0"+ phone;
    }
}
