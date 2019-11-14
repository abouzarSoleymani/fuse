import {LocationModel} from 'app/core/model/location.model';

export class RideStatesModel{
    choiseState: number = 0;
    iPassengerId: string = '';
    dSourceLatitude: string = '';
    dSourceLongitude:  string = '';
    dDestinationLatitude:  string = '';
    dDestinationLongitude:  string = '';
    iVehicleTypeId:  string = '';
    vWaitType:  string = '';
    vSweep:  boolean = false;
    secoundDestination:  boolean = false;
    dDestinationLongitude2:  string = '';
    dDestinationLatitude2:  string = '';
    vVoucherCode:  string = '';
    vVoucherCodeConfirmed:  boolean = false;
    iRideRequestId:  string = '';
    fWaitingChargesPrice:  number = 0;
    eVehicleUse:  string = '';
    waitingTimePassenger: number = 100;
    waitingStatus = false;
    DriverEnroute = false;
    ReadyForPickup = false;
    PassengerOnBoard = false;
    ReachedDestination = false;
    fAmount: string = '';
}