import { Component, OnInit } from '@angular/core';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {MatDialog} from '@angular/material';
import {DialogWaitingListComponent} from 'app/shared/dialog-waiting-list/dialog-waiting-list.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {DialogsService} from 'app/core/service/dialogs.service';

@Component({
  selector: 'body-waiting-near-driver',
  templateUrl: './body-waiting-near-driver.component.html',
  styleUrls: ['./body-waiting-near-driver.component.scss'],
    animations: [
        trigger('changeDivSize', [
            state('initial', style({
                backgroundColor: '#1E2129',
                color: '#ffffff',
                width: '130px',
                height: '40px'
            })),
            state('final', style({
                backgroundColor: '#1E2129',
                color: '#ffffff',
                width: '200px',
                height: '40px'
            })),
            transition('initial=>final', animate('1500ms')),
            transition('final=>initial', animate('1000ms'))
        ]),
    ]
})
export class BodyWaitingNearDriverComponent implements OnInit {
    interval;
    time:number = -1;
    currentState = 'initial';
    constructor(private rideOptionService: RideOptionService,
              private errorDialog: ErrorDialogService,
              public dialog: MatDialog,
              private dialogsService: DialogsService) { }

  ngOnInit() {
      clearInterval(this.interval)
  }
    getMouseUp(){
        this.currentState = 'initial';
        clearInterval(this.interval)
        this.time = 0;
    }
    getMouseDown(){
        this.currentState = 'final';
        this.interval = setInterval( () =>{
          this.time += 1;
          console.log(this.time)
          if(this.time == 2){
              clearInterval(this.interval)
              this.cancelReasonAlert();
           }
      }, 1000)
    }
    onRightClick(event){
        this.currentState = 'initial';
        clearInterval(this.interval)
    }
    cancelReasonAlert(){
        this.dialogsService.openDialogTravelOptions(DialogWaitingListComponent)
    }
    getKeyPress(event){
      console.log(event);
    }

}
