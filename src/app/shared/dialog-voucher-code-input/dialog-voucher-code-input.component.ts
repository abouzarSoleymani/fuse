import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RideOptionService} from 'app/core/service/rideOption.service';

@Component({
  selector: 'dialog-voucher-code-input',
  templateUrl: './dialog-voucher-code-input.component.html',
  styleUrls: ['./dialog-voucher-code-input.component.scss']
})
export class DialogVoucherCodeInputComponent implements OnInit {

  description: string = 'ثبت کد تخفیف';
  voucherForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<DialogVoucherCodeInputComponent>,
              private rideOptionService: RideOptionService,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
      this.voucherForm = this._formBuilder.group({
          voucher: ['']
      });
      this.voucherForm.reset();
  }
    save() {
      const val = this.voucherForm.value;
      console.log(val.voucher)
      this.rideOptionService.checkVoucher(val.voucher)
      this.dialogRef.close();
    }

    close() {
        this.dialogRef.close();
    }
}
