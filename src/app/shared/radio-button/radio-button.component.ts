import { Component, OnInit, Input, ChangeDetectionStrategy, ViewChild,ChangeDetectorRef, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
    selector: 'radio-button',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="radio">
      <input [id]="id" [name]="_name" type="radio" [value]="value" [checked]="_checked">
      <label [attr.for]="id" class="radio-label">
        <ng-content></ng-content>
      </label>
   </div>
  `,
    styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {
    @ViewChild('radio', {static: false}) radio;
    id = Math.random();
    _name;
    _checked;
    @Input() value;

    @Input() set name(value) {
        this._name = value;
        this.cdr.markForCheck();
    }

    @Input() set checked(value) {
        this._checked = value;
        this.cdr.markForCheck();
    }

    constructor(public host: ElementRef, private cdr: ChangeDetectorRef) {

    }

    getInput() {
        return this.host.nativeElement.querySelector('input')
    }

    ngOnInit() {
    }

}