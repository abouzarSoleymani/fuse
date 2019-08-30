import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import {AppState} from 'app/reducers';
import {noop} from 'rxjs';
import {Login} from '../auth.actions';
import {tap} from 'rxjs/operators';
import {AuthService} from 'app/modules/authentication/auth.service';
import {Router} from '@angular/router';
import {User} from 'app/model/user.model';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {Ride} from 'app/modules/authentication/ride.actions';
import {RideStatesModel} from 'app/model/rideStates.model';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    @ViewChild('swal', {static: true}) private swal: SwalComponent;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     * @param store
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private store: Store<AppState>,
        private auth: AuthService,
        private router: Router,
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
        this.loginForm = this._formBuilder.group({
            mobile   : ['', [Validators.required]],
            password: ['', Validators.required]
        });
    }

    login(): void{

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        let user: User;
        const val = this.loginForm.value;
        this.auth.login(val.mobile, val.password)
            .pipe(
                tap((data: ResponseApiModel<any>) => {
                    if(data.settings.success === '1'){
                        Toast.fire({
                            type: 'success',
                            title: data.settings.message
                             })
                        user = data.data[0];
                        this.store.dispatch(new Login({data}));
                        this.store.dispatch(new Ride({data: new RideStatesModel()}));
                        this.router.navigateByUrl('/apps');
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
