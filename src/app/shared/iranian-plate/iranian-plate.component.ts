import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'iranian-plate',
  templateUrl: './iranian-plate.component.html',
  styleUrls: ['./iranian-plate.component.scss']
})
export class IranianPlateComponent implements OnInit {

    numbers = '';
    character = '';
    section = '';
  private _vehicleNumber = new BehaviorSubject<any>('');

    @Input()
    set vehicleNumber(value) {
        this._vehicleNumber.next(value);
    };
    get vehicleNumber() {
        return this._vehicleNumber.getValue();
    }

  constructor() { }

  ngOnInit() {
      this._vehicleNumber
          .subscribe(x => {
              if(this.vehicleNumber){
                  if(this.vehicleNumber.detail != null)
                      this.just_persian(this.vehicleNumber.detail)
                   this.section = this.vehicleNumber.section;
              }
          });
  }
  just_persian(str){
        let p = /^[\u0600-\u06FF\s]+$/;
        for(let char of str) {
            if (p.test(char)){
                this.character = char;
            }else{
                this.numbers += char;
            }
        }
    }
}
