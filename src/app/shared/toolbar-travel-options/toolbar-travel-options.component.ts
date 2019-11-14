import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DialogsService} from 'app/core/service/dialogs.service';
import {DialogTravelOptionsComponent} from 'app/shared/dialog-travel-options/dialog-travel-options.component';
import {DialogVoucherCodeInputComponent} from 'app/shared/dialog-voucher-code-input/dialog-voucher-code-input.component';
import {Ride} from 'app/modules/authentication/ride.actions';
import {RideOptionService} from 'app/core/service/rideOption.service';

@Component({
  selector: 'toolbar-travel-options',
  templateUrl: './toolbar-travel-options.component.html',
  styleUrls: ['./toolbar-travel-options.component.scss'],

})
export class ToolbarTravelOptionsComponent implements OnInit {

    price;
  constructor(private dialogsService: DialogsService,
              private rideOptionService: RideOptionService) { }

  ngOnInit(): void {
      this.rideOptionService.getFareAmount().subscribe(
          (data) => {
              this.price = data;
          }
      )
  }
    travelOptions(): void {
         this.dialogsService.openDialogTravelOptions(DialogTravelOptionsComponent);
    }
    checkVoucher(): void {
         this.dialogsService.openDialogTravelOptions(DialogVoucherCodeInputComponent);
    }
}
