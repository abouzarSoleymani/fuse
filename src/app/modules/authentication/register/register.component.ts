import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';
import {noop, Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';
import {Login} from 'app/modules/authentication/auth.actions';
import {AuthenticationModule} from 'app/modules/authentication/authentication.module';
import {AuthService} from 'app/modules/authentication/auth.service';
import {User} from 'app/model/user.model';
import {ResponseApiModel} from 'app/model/responseApi.model';
import Swal from "sweetalert2";
import {Router} from '@angular/router';
import {ShareDataService} from 'app/core/service/share.data.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    user = new User();
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private dataService: ShareDataService
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.registerForm = this._formBuilder.group({
            vFirstName: ['', Validators.required],
            vLastName: ['', Validators.required],
            vMobileNumber: ['', [Validators.required, Validators.pattern('^[0][9][0-9][0-9]{8,8}$')]],
            vPassword: ['', [Validators.required, Validators.minLength(8)]],
/*
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
*/
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
/*        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });*/
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    register(): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        const val = this.registerForm.value;
        this.router.navigateByUrl('/auth/register/verify');
        this.dataService.changeData(val.vMobileNumber);
        this.auth.register(val)
            .pipe(
                tap((data: ResponseApiModel<any>) => {
                    if(data.settings.success === '1'){
                        Toast.fire({
                            type: 'success',
                            title: data.settings.message
                        })
                        this.router.navigateByUrl('/auth/register/verify');
                    }else{
                        Toast.fire({
                            type: 'error',
                            title: data.settings.message
                        })
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
                    })
                }
            );

    }


    mobileValidate(control: AbstractControl) {
        let mobile = /^[0][9][0-9][0-9]{8,8}$/;
        if(control.value != null && control.value != '' ) {
            if (!mobile.test(control.value)) {
                return {mobile: true};
            }
        }
        return null;
    }
    openRules(){
        Swal.fire({
            title: '<strong>قوانین و مقررات</strong>',
            type: 'info',
            html:
                'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد وزمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.',
            showCloseButton: true,
            focusConfirm: false,
            animation: false,
            confirmButtonText:
                ' قبول دارم',
            confirmButtonAriaLabel: 'Thumbs up, great!',
        })
    }

}
    /**
     * Confirm password validator
     *
     * @param {AbstractControl} control
     * @returns {ValidationErrors | null}
     */
    export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

        if (!control.parent || !control) {
            return null;
        }

        const password = control.parent.get('password');
        const passwordConfirm = control.parent.get('passwordConfirm');

        if (!password || !passwordConfirm) {
            return null;
        }

        if (passwordConfirm.value === '') {
            return null;
        }

        if (password.value === passwordConfirm.value) {
            return null;
        }

        return {'passwordsNotMatching': true};
    };
