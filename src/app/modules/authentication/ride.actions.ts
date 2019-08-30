import { Action } from '@ngrx/store';



export enum RideActionTypes {
    RideAction = '[Ride] Get State Ride',
}


export class Ride implements Action {

    readonly type = RideActionTypes.RideAction;

    constructor(public payload: {data: any}) {
    }
}

export type RideActions = Ride;