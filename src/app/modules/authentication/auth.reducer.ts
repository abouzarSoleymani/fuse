import {User} from 'app/model/user.model';
import {AuthActions, AuthActionTypes} from 'app/modules/authentication/auth.actions';
import {ResponseApiModel} from 'app/model/responseApi.model';


export interface AuthState {
    loggedIn: boolean,
    data: ResponseApiModel<any>
}

export const initialAuthState: AuthState = {
    loggedIn: false,
    data: undefined
};

export function authReducer(state = initialAuthState,
                            action: AuthActions): AuthState {
    switch (action.type) {

        case AuthActionTypes.LoginAction:
            return {
                loggedIn: true,
                data: action.payload.data
            };

        case AuthActionTypes.LogoutAction:
            return {
                loggedIn: false,
                data: undefined
            };

        default:
            return state;
    }
}