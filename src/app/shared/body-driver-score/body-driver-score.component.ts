import {Component, OnInit, ViewChild} from '@angular/core';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {PassengerReasonsComponent} from 'app/shared/passenger-reasons/passenger-reasons.component';
import {ConfigRideLayoutService} from 'app/core/service/configRideLayout.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';

@Component({
  selector: 'body-driver-score',
  templateUrl: './body-driver-score.component.html',
  styleUrls: ['./body-driver-score.component.scss']
})
export class BodyDriverScoreComponent implements OnInit {
    rideDetails;
    starCount = 5;
    rating = 0 ;
    selectedPassengerReason = '';
    selectedCallReason = '';
    comment;
    selectedRating;
    starColor: string = 'accent';
    showPassengerReason = false;
    showCallReason = false;
    @ViewChild('passengerReasons', {static: false}) passengerReasons: PassengerReasonsComponent;

    constructor(private rideOptionService: RideOptionService,
                private configRideLayoutService: ConfigRideLayoutService,
                private errorDialog: ErrorDialogService) { }

    ngOnInit() {
        if(this.rideDetails == null){
            this.rideOptionService.getPassengerRideDetail().subscribe(
                (data) => {
                    this.rideDetails = data.data[0];
                }
            )
        }
    }
    onRatingChanged(rating){
        console.log(rating)
        this.selectedRating = rating;
        if(rating <= 3){
            this.showPassengerReason = true;
            this.showCallReason = false;
        }else{
            this.showPassengerReason = false;
        }
    }

    setPassengerSelectedReason(event){
        console.log(event)
        this.selectedPassengerReason = event;
    }
    setCallSelectedReason(event){
        console.log(event)
        this.selectedCallReason = event;
    }
    passengerRideFeedback(){
        let fStarRating = this.selectedRating;
        let iPassengerReasonId = this.selectedPassengerReason;
        let vComment =  this.passengerReasons.getComment();
        console.log(fStarRating, iPassengerReasonId, vComment);
        this.rideOptionService.getPassengerRideFeedback(fStarRating, vComment, iPassengerReasonId).subscribe(
            (data) => {
                    console.log(data);
                    this.rideOptionService.resetRideOption();
            })
    }
    callSupport(){
        this.showCallReason = true;
        this.showPassengerReason = false;
    }

}
