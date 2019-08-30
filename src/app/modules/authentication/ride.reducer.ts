import {RideActions, RideActionTypes} from 'app/modules/authentication/ride.actions';


export interface AuthState {
    data: any
}

export const initialAuthState: AuthState = {
    data: undefined
};

export function rideReducer(state = initialAuthState,
                            action: RideActions): AuthState {
    switch (action.type) {

        case RideActionTypes.RideAction:
            return {
                data: action.payload.data
            };

        default:
            return state;
    }
}