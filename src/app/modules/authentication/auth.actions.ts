import { Action } from '@ngrx/store';
import {ResponseApiModel} from 'app/core/model/responseApi.model';



export enum AuthActionTypes {
    LoginAction = '[Login] Action',
    LogoutAction = '[Logout] Action',
}


export class Login implements Action {

    readonly type = AuthActionTypes.LoginAction;

    constructor(public payload: {data: ResponseApiModel<any>}) {

    }
}


export class Logout implements Action {

    readonly type = AuthActionTypes.LogoutAction;


}


export type AuthActions = Login | Logout;