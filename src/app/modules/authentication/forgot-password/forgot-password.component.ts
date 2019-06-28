import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import Swal from "sweetalert2";
import {User} from 'app/model/user.model';
import {tap} from 'rxjs/operators';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {Login} from 'app/modules/authentication/auth.actions';
import {noop} from 'rxjs';
import {AuthService} from 'app/modules/authentication/auth.service';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private auth: AuthService
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            vMobileNumber: ['', [Validators.required, Validators.pattern('^[0][9][0-9][0-9]{8,8}$')]],
        });
    }
    forgotPassword(): void {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        const val = this.forgotPasswordForm.value;
        this.auth.forgotPassword(val.vMobileNumber)
            .pipe(
                tap((data: ResponseApiModel<any>) => {
                    if(data.settings.success === '1'){
                        Toast.fire({
                            type: 'success',
                            title: data.settings.message
                        })
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
}
