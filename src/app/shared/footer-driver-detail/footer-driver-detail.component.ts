import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {DialogsService} from 'app/core/service/dialogs.service';
import {DialogTravelOptionsComponent} from 'app/shared/dialog-travel-options/dialog-travel-options.component';

@Component({
  selector: 'footer-driver-detail',
  templateUrl: './footer-driver-detail.component.html',
  styleUrls: ['./footer-driver-detail.component.scss']
})
export class FooterDriverDetailComponent implements OnInit {
   rideDetails;
   price;
  constructor(private rideOptionService: RideOptionService,
              private cdRef: ChangeDetectorRef,
              private dialogsService: DialogsService) { }

  ngOnInit() {
      if(this.rideDetails == null){
          this.rideOptionService.getPassengerRideDetail().subscribe(
              (data) => {
                  this.rideDetails = data.data[0];
              }
          )
      }
      this.rideOptionService.getFareAmount().subscribe(
          (data) => {
              this.price = data;
          }
      )
  }
    travelOptions(){
      this.dialogsService.openDialogTravelOptions(DialogTravelOptionsComponent);
    }
    checkVoucher(){
        this.dialogsService.openDialogTravelOptions(DialogTravelOptionsComponent);
    }
    payOnline(){
      console.log('payOnline');
    }
    callWithDriver(phone){
         console.log('callwithDriver');
        document.location.href="tel:0"+ phone;
    }
}
