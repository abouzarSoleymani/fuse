import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {noop, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareDataService} from 'app/core/service/share.data.service';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {AuthService} from 'app/modules/authentication/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'verify-code',
    templateUrl: './verify-code.component.html',
    styleUrls: ['./verify-code.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
    verifyCodeForm: FormGroup;
    vMobileNumber: string;
    showTimer;
    time = 0;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private dataService: ShareDataService,
        private router: Router,
        private auth: AuthService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        dataService.currentData.subscribe(data => this.vMobileNumber = data);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.verifyCodeForm = this._formBuilder.group({
            vMobileNumber: [''],
            iOTP: ['', [Validators.required]],
        });
        this.startTimer();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    verify(): void {

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        const val = this.verifyCodeForm.value;
        val.vMobileNumber = this.vMobileNumber;
        this.auth.verify(val)
            .pipe(
                tap((data: ResponseApiModel<any>) => {
                    if (data.settings.success === '1') {
                        Toast.fire({
                            type: 'success',
                            title: data.settings.message
                        });
                        this.router.navigateByUrl('/');
                    } else {
                        Toast.fire({
                            type: 'error',
                            title: data.settings.message
                        });
                    }

                })
            )
            .subscribe(
                noop,
                () => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'error',
                        title: 'عدم برقراری ارتباط با سرور',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            );

    }

    resend(): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        const mobile = {'vMobileNumber': this.vMobileNumber};
        this.auth.resend(mobile)
            .pipe(
                tap((data: ResponseApiModel<any>) => {
                    if (data.settings.success === '1') {
                        Toast.fire({
                            type: 'success',
                            title: data.settings.message
                        });
                        this.showTimer = true;
                        this.time = 30;
                        this.startTimer();
                    } else {
                        Toast.fire({
                            type: 'error',
                            title: data.settings.message
                        });
                    }

                })
            )
            .subscribe(
                noop,
                () => {
                    Swal.fire({
                        position: 'top-end',
                        type: 'error',
                        title: 'عدم برقراری ارتباط با سرور',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            );
    }

    myTimer(time) {
        if (time.toString().length > 1) {
            document.getElementById('timer').innerHTML = '00:' + time;
        }else{
            document.getElementById('timer').innerHTML = '00:0' + time;
        }
        return time - 1;
    }
    startTimer(): void {
        if(this.time > 0){
            const interval = setInterval(() => {
                this.myTimer(this.time);
                if (this.time === 0) {
                    clearInterval(interval);
                    this.showTimer = false;
                }
                this.time = this.time - 1;
            }, 1000);
        }
    }
}
