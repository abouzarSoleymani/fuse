import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {GeocodingService} from 'app/modules/main/map/geocoding.service';
import {map} from 'rxjs/operators';
import {RideStatesModel} from 'app/model/rideStates.model';
import {FuseConfigService} from '@fuse/services/config.service';
import {bootloader} from '@angularclass/hmr';
import Swal from "sweetalert2";
import {MatDialog, MatDialogConfig} from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class RideOptionService {
    user: ResponseApiModel<any>;
    requestConfirmRide = new Subject();
    fareAmount = new BehaviorSubject('');
    emmitAddNewMarker = new Subject();
    emmitWaiting = new Subject();
    emmitDriverDetail = new Subject();
    emmitDriverScore = new Subject();
    interval;
    markers: any [] = [];
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private errorDialog: ErrorDialogService,
              private localStorage: LocalStorageService,
              private apiCall: ApiCallService,
              private geocoder: GeocodingService,
              private _fuseConfigService: FuseConfigService,
              private dialog: MatDialog
           ) {}

  getWaitTypeList(): Observable<any>{
      if(isLoggedIn){
          return this.apiCall.getResponse('wait_type_list', '' );
         }
    }
    passengerCancelRide(selectedOption): Observable<any>{
        let vCancelledReasonDesc = '';
        if(selectedOption != '' || selectedOption != null)
            vCancelledReasonDesc = selectedOption;
        let rideOptions = this.localStorage.getItem('ride');
/*        vCancelledReasonDesc || '',
            iRideRequestId,
            iPassengerId,
            eType || "",*/
        let data = {
            vCancelledReasonDesc: vCancelledReasonDesc,
         //   iRideRequestId: rideOptions.iRideRequestId,
            iRideRequestId: rideOptions.iRideRequestId,
            iPassengerId: rideOptions.iPassengerId,
            eType: vCancelledReasonDesc == ''? 'Force' : '',
        }
        if(isLoggedIn){
            return this.apiCall.getResponse('passenger_cancel_ride', data);
        }
    }

   getPassengerValidateVoucher(voucherCode): Observable<any>{
        let data = {
            iPassengerId: '',
            vVoucherCode: '',
            fAmount: '',
            dSourceLatitude: '',
            dSourceLongitude: '',
            dDestinationLatitude: '',
            dDestinationLongitude: ''
        }
                if(isLoggedIn){
                    this.user = this.localStorage.getItem('user');
                    data.iPassengerId = (this.user.data[0].iPassengerId).toString();
                    data.fAmount = this.fareAmount.getValue().toString();
                    data.vVoucherCode = voucherCode;
                    data.dSourceLatitude = this.geocoder.locations[0].lat.toString();
                    data.dSourceLongitude = this.geocoder.locations[0].lng.toString();
                    data.dDestinationLatitude = this.geocoder.locations[1].lat.toString();
                    data.dDestinationLongitude = this.geocoder.locations[1].lng.toString();
                    return this.apiCall.getResponse('passenger_validate_voucher', data );
                }
    }
    getPassengerEstimateFare(){
/*            iPassengerId: '',
            dSourceLatitude: '',
            dSourceLongitude: '',
            dDestinationLatitude: '',
            dDestinationLongitude: '',
            iVehicleTypeId: '',
            vWaitType: '',
            vSweep: '',
            dDestinationLongitude2: '',
            dDestinationLatitude2: '',
            vVoucherCode: '',
            iRideRequestId: '',
            fWaitingChargesPrice: '',
            eVehicleUse: '',*/
        if(isLoggedIn){
             this.apiCall.getResponse('passenger_estimate_fare', this.getRideoptions()).subscribe(
                 (data: any) => {
                     if(data.data[0])
                         this.setFareAmount(data.data[0].fTotalFare);
                     this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                 }
             );
        }
    }
    getRideoptions(){
        return this.localStorage.getItem('ride');
    }
    getPassengerConfirmRide(): Observable<any>{
        if(isLoggedIn){
            return this.apiCall.getResponse('passenger_confirm_ride', this.getRideoptions() );
        }
    }
    getCancelResonList(): Observable<any>{
        if(isLoggedIn){
            let cancelReson = {eCancelledBy: 'Passenger' };
            return this.apiCall.getResponse('cancel_reason_list', cancelReson );
        }
    }

    getPassengerRideDetail(): Observable<any>{
        if(isLoggedIn){
            let rideOptions = this.getRideoptions();
            let data = {iRideRequestId: rideOptions.iRideRequestId,
             iPassengerId: rideOptions.iPassengerId.toString()}
            return this.apiCall.getResponse('passenger_ride_detail', data );
        }
    }
    getPassengerRideFeedback(fStarRating, vComment, iPassengerReasonId): Observable<any>{
        if(isLoggedIn){
            let rideOptions = this.getRideoptions();
            let data = {iRideRequestId: rideOptions.iRideRequestId,
             iPassengerId: rideOptions.iPassengerId.toString(),
             fStarRating: fStarRating.toString(),
             vComment: vComment.toString(),
             iPassengerReasonId: iPassengerReasonId.toString()
            }
            return this.apiCall.getResponse('passenger_ride_feedback', data );
        }
    }
    getPassengerReason(): Observable<any>{
        if(isLoggedIn){
            return this.apiCall.getResponse('passenger_reason', {} );
        }
    }
    getRidePath(): Observable<any>{
        if(isLoggedIn){
            let rideOptions = this.getRideoptions();
            let data = {iRideRequestId: rideOptions.iRideRequestId,
             iPassengerId: rideOptions.iPassengerId.toString()}
            return this.apiCall.getResponse('get_ride_path', data );
        }
    }

    getFareAmount(): Observable<any>{
        return this.fareAmount.asObservable();
    }
    clearIntervalRide(){
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    resetRideOption(){
        this.clearIntervalRide();
        this.geocoder.resetMarkers();
       // this.localStorage.setItem('ride', new RideStatesModel());
        this.geocoder.emitChangePinUrl.next(true);
        let config = {
            layout:
                {
                    navbar: {
                        hidden: false
                    },
                    toolbar: {
                        hidden: false
                    },
                    footer : {
                        hidden: true
                    }
                }
        };
        this._fuseConfigService.setConfig(config);
        this.geocoder.markersChanged.next(true);
    }
    setFareAmount(amount){
        this.fareAmount.next(amount);
    }
    secondDestination(second){
        if(second){
            this.emmitAddNewMarker.next(true);
        }else{
            this.localStorage.updateItem('ride', {dDestinationLongitude2: ''});
            this.localStorage.updateItem('ride', {dDestinationLatitude2: ''});
            this.geocoder.popMarker();
        }
    }

    getIntervalRidePath(){
        this.getRidePath().subscribe(
            (data) => {
                console.log(data)
                if(data.data.length != 0){
                    this.isRideStatus(data.data[0])
                }
            })
    }

    isRideStatus(status){
        let rideOptions = this.getRideoptions();
        //if(status.lenght>0){
            let config = {
                layout:
                    {
                        navbar: {
                            hidden: true
                        },
                        toolbar: {
                            hidden: true
                        },
                        footer : {
                            hidden: true
                        }
                    }
            };
            this._fuseConfigService.setConfig(config);
       // }
        this.interval = setInterval(() => {
            this.getRidePath().subscribe(
                (data:any) => {
                    const status = data.data[0]
                    this.checkeRideStatus(status);
                })
        }, 100 * rideOptions.waitingTimePassenger);
    }

    checkeRideStatus(status) {
        const rideOptions = this.getRideoptions();
        if (status.eRideStatus == 'DriverEnroute' || status.eRideStatus == 'ReadyForPickup' || status.eRideStatus == 'PassengerOnBoard') {
                this.geocoder.resetVehicleMarkers();
                this.geocoder.addVehicleOnRouteOnMap(status);
            }
            if (status.eRideStatus == '') {
                if (!rideOptions.waitingStatus) {
                    this.emmitWaiting.next(true);
                    this.localStorage.updateItem('ride', {waitingStatus: true});
                }
            } else if (status.eRideStatus == 'DriverEnroute') {
                if (!rideOptions.DriverEnroute) {
                    this.emmitWaiting.next(false);
                    this.emmitDriverDetail.next(true);
                    this.localStorage.updateItem('ride', {DriverEnroute: true});
                }
            } else if (status.eRideStatus == 'ReadyForPickup') {
                if (!rideOptions.ReadyForPickup) {
                    this.errorDialog.openDialog('به مبدا رسید و منتظر سوار شدن شماست', 1, 'alert');
                    this.localStorage.updateItem('ride', {ReadyForPickup: true});
                }
            } else if (status.eRideStatus == 'PassengerOnBoard') {
                if (!rideOptions.PassengerOnBoard) {
                    this.errorDialog.openDialog('مسافر سوار شد', 1, 'alert');
                    this.localStorage.updateItem('ride', {PassengerOnBoard: true});
                }
            } else if (status.eRideStatus == 'ReachedDestination') {
                if (!rideOptions.ReachedDestination) {
                    this.errorDialog.openDialog('پایان سفر', 1, 'alert');
                    this.emmitDriverDetail.next(false);
                    this.emmitDriverScore.next(true);
                    this.clearIntervalRide();
                    this.localStorage.updateItem('ride', {ReachedDestination: true});
                }
            }else if(status.eRideStatus == 'Cancelled'){
                    this.resetRideOption();
            }
        }

    checkVoucher(vCode){
        this.getPassengerValidateVoucher(vCode).subscribe(
            (data) => {

                //   fTotalFarePayable  مبلغ قابل پرداخت
                //    fPriceDiscount مبلغ تخفیف

                //  this.errorDialog.openDialog(data.settings.message, data.settings.success, 'alert');
                    if(data.settings.success == 0){
                        this.errorDialog.openDialog(data.settings.message, data.settings.success, 'alert');
                    }else   if(data.settings.success == 1){
                        Swal.fire({
                            title: 'آیا مطمئن هستید؟',
                            type: 'success',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'بله',
                            cancelButtonText: 'خیر',
                            html:
                                '<b>:مبلغ قابل پرداخت</b>' + data.data[0].fTotalFarePayable +
                                '<b>:مبلغ تخفیف</b>' + data.data[0].fPriceDiscount
                        }).then((result) => {
                            if (result.value) {
                                this.setFareAmount(data.data[0].fTotalFarePayable);
                                this.localStorage.updateItem('ride', {vVoucherCode: vCode})
                                this.localStorage.updateItem('ride', {fAmount: data.data.fTotalFarePayable})
                            }
                        })
                    }
            })
         }




    }


/*            this.getPassengerRideDetail().subscribe(
                (data) => {
                })*/