import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {MatRadioChange} from '@angular/material';

@Component({
  selector: 'app-passenger-reasons',
  templateUrl: './passenger-reasons.component.html',
  styleUrls: ['./passenger-reasons.component.scss']
})
export class PassengerReasonsComponent implements OnInit {

    @Output() radioChange?: EventEmitter<MatRadioChange> = new EventEmitter;
    reasons :any[] = [];
    commentValue: string;
    @Input() reasonsForm: FormGroup;


    constructor(private rideOptions: RideOptionService,
                private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.passengerReason();
        this.reasonsForm = this.formBuilder.group({
            comment: ['']
        })


    }
    passengerReason(){
        this.rideOptions.getPassengerReason().subscribe(
            (data) =>{
                if(data.data){
                    this.reasons = data.data;
                    console.log(this.reasons)
                    /*0: {iPassengerReasonId: 96, vTitle: "انتخاب مسیر اشتباه", vDesc: ""}
                    1: {iPassengerReasonId: 97, vTitle: "وضعیت نامناسب خودرو", vDesc: ""}
                    2: {iPassengerReasonId: 98, vTitle: "حرف زدن زیاد راننده", vDesc: ""}
                    3: {iPassengerReasonId: 99, vTitle: "وضعیت نامناسب گرمایشی و سرمایشی خودرو", vDesc: ""}
                    4: {iPassengerReasonId: 101, vTitle: "غیره", vDesc: ""}
                    5: {iPassengerReasonId: 106, vTitle: "بلند بودن صدای موزیک ", vDesc: ""}*/
                }
            })
    }
    onClick(index, value) {
        this.radioChange.emit(index)
    }
    doSomething(newComment) {
        this.commentValue = this.reasonsForm.get('comment').value;
    }
    getComment(){
        return this.commentValue || '';
    }
}
