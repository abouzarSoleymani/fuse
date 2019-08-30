import {Component, OnInit, ViewChild} from '@angular/core';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {PassengerReasonsComponent} from 'app/shared/passenger-reasons/passenger-reasons.component';

@Component({
  selector: 'app-driver-score',
  templateUrl: './driver-score.component.html',
  styleUrls: ['./driver-score.component.scss']
})
export class DriverScoreComponent implements OnInit {
    rideDetails;
    starCount = 5;
    rating = 0 ;
    selectedReason = '';
    comment;
    selectedRating;
    starColor: string = 'accent';
    showPassengerReason = false;
    @ViewChild('passengerReasons', {static: false}) passengerReasons: PassengerReasonsComponent;

    constructor(private rideOptions: RideOptionService) { }

    ngOnInit() {
        if(this.rideDetails == null){
            this.rideOptions.getPassengerRideDetail().subscribe(
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
        }else{
            this.showPassengerReason = false;
        }
    }

    setSelectedReason(event){
        console.log(event)
        this.selectedReason = event;
    }
    passengerRideFeedback(){
        let fStarRating = this.selectedRating;
        let iPassengerReasonId = this.selectedReason;
        let vComment =  this.passengerReasons.getComment();
        console.log(fStarRating, iPassengerReasonId, vComment);
        this.rideOptions.getPassengerRideFeedback(fStarRating, vComment, iPassengerReasonId).subscribe(
            (data) => {
                    console.log(data);
                    this.rideOptions.resetRideOption();
                    this.rideOptions.emmitDriverScore.next(false);
            })
    }

}
