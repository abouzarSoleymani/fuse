import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {RideActionTypes, Ride} from './ride.actions';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {defer, of} from 'rxjs';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {RideStatesModel} from 'app/model/rideStates.model';
import {ResponseApiModel} from 'app/model/responseApi.model';


@Injectable()
export class RideEffects {

    user: ResponseApiModel<any>;

    @Effect({dispatch: false})
    ride$ = this.actions$.pipe(
        ofType<Ride>(RideActionTypes.RideAction),
        tap((action) => {
                this.localStorage.setItem('ride', action.payload.data);
                this.user = this.localStorage.getItem('user');
                this.localStorage.updateItem('ride', {iPassengerId: this.user.data[0].iPassengerId.toString()})
                this.localStorage.updateItem('ride', {waitingTimePassenger: this.user.config.WAITING_TIME_PASSENGER})
            }
        )
    );

    @Effect()
    init$ = defer(() => {

        const rideData = this.localStorage.getItem('ride');
        if (rideData) {
            return of(new Ride({data: rideData}));
           // this.localStorage.setItem('ride', new RideStatesModel());

        }
        else {
            this.localStorage.setItem('ride', new RideStatesModel());
        }

    });

    constructor(private actions$: Actions, private router: Router,
                private localStorage: LocalStorageService) {

    }


}