import {LocationModel} from 'app/model/location.model';

export class RideStatesModel{
    choiseState: number = 0;
    iPassengerId: string = '';
    dSourceLatitude: string = '';
    dSourceLongitude:  string = '';
    dDestinationLatitude:  string = '';
    dDestinationLongitude:  string = '';
    iVehicleTypeId:  string = '';
    vWaitType:  string = '';
    vSweep:  number = 0;
    dDestinationLongitude2:  string = '';
    dDestinationLatitude2:  string = '';
    vVoucherCode:  string = '';
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