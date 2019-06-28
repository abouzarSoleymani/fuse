import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AuthActionTypes, Login, Logout} from './auth.actions';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {defer, of} from 'rxjs';
import {LocalStorageService} from 'app/core/service/local-storage.service';


@Injectable()
export class AuthEffects {

    @Effect({dispatch: false})
    login$ = this.actions$.pipe(
        ofType<Login>(AuthActionTypes.LoginAction),
        tap(action => this.localStorage.setItem('user', action.payload.data))
    );

    @Effect({dispatch: false})
    logout$ = this.actions$.pipe(
        ofType<Logout>(AuthActionTypes.LogoutAction),
        tap(() => {

            this.localStorage.removeItem('user');
            this.router.navigateByUrl('/auth/login');

        })
    );

    @Effect()
    init$ = defer(() => {

        const userData = this.localStorage.getItem('user');

        if (userData) {
            return of(new Login({data: userData}));
        }
        else {
            return <any>of(new Logout());
        }

    });

    constructor(private actions$: Actions, private router: Router,
                private localStorage: LocalStorageService) {


    }


}