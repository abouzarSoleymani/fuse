import { Component, OnInit, forwardRef, Input, ChangeDetectorRef, ChangeDetectionStrategy, ContentChildren, QueryList } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonComponent } from '../radio-button/radio-button.component';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { mapTo } from 'rxjs/operators';

const RADIO_GROUP_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioGroupComponent),
    multi: true
};

@Component({
    selector: 'radio-group',
    providers: [RADIO_GROUP_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <ng-content></ng-content>
  `
})
export class RadioGroupComponent implements OnInit, ControlValueAccessor {
    @ContentChildren(RadioButtonComponent, { descendants: true }) radios: QueryList<RadioButtonComponent>;
    @Input() name;
    onTouched;
    onChange;
    model;
    sub;
    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
    }

    ngAfterContentInit() {
        const changes$ = this.radios.map(radio => {
            radio.name = this.name || Math.random();
            if (this.model === radio.value) {
                radio.checked = true;
            }
            return fromEvent(radio.getInput(), 'click').pipe(
                mapTo(radio)
            )
        });

        this.sub = merge(...changes$).subscribe((radio) => {
            this.onChange(radio.value);
        });


    }

    ngOnDestroy() {
        this.sub && this.sub.unsubscribe();
    }

    writeValue(value): void {
        this.model = value;
    }

    registerOnChange(fn): void {
        this.onChange = fn;
    }

    registerOnTouched(fn): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
    }

}