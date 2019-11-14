import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatRadioChange} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';

@Component({
  selector: 'app-call-support-reasons',
  templateUrl: './call-support-reasons.component.html',
  styleUrls: ['./call-support-reasons.component.scss']
})
export class CallSupportReasonsComponent implements OnInit {

    @Output() radioChange?: EventEmitter<MatRadioChange> = new EventEmitter;
    reasons :any[] = [];
    commentValue: string;
    @Input() reasonsForm: FormGroup;


    constructor(private rideOptionService: RideOptionService,
                private formBuilder: FormBuilder,
                private errorDialog: ErrorDialogService) { }

    ngOnInit() {
        this.passengerReason();
        this.reasonsForm = this.formBuilder.group({
            comment: ['']
        })


    }
    passengerReason(){
        this.rideOptionService.supportTopicList().subscribe(
            (data) => {
                this.reasons = data.data;
                /*                data:
                                    [
                                      0: {iSupportTopicId: 2, vText: "سایر گزینه ها", iParentTopicId: 0, iChildCount: 0}
                                      1: {iSupportTopicId: 3, vText: "مشکلی در اپلیکیشن داشتم ", iParentTopicId: 0, iChildCount: 0}
                                      2: {iSupportTopicId: 4, vText: "مشکلی با سفر و یا راننده داشتم", iParentTopicId: 0, iChildCount: 0}
                                      3: {iSupportTopicId: 5, vText: "وسیله ای در خودرو جا گذاشتم ", iParentTopicId: 0, iChildCount: 0}
                                      4: {iSupportTopicId: 6, vText: "شارژ کردم اما اعتبار اضافه نشد", iParentTopicId: 0, iChildCount: 0}
                                      5: {iSupportTopicId: 7, vText: "اختلاف حساب و هزینه سفر", iParentTopicId: 0, iChildCount: 0}
                                    ]*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            })
    }
    onClick(reason) {
        this.radioChange.emit(reason.iSupportTopicId)
    }
    doSomething(newComment) {
        this.commentValue = this.reasonsForm.get('comment').value;
    }
    getComment(){
        return this.commentValue || '';
    }
}
