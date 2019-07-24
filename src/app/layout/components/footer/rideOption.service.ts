import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {Observable} from 'rxjs';
import {GeocodingService} from 'app/modules/main/map/geocoding.service';


@Injectable({
  providedIn: 'root'
})
export class RideOptionService {
    user: ResponseApiModel<any>;
    markers: any [] = [];
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private errorDialog: ErrorDialogService,
              private localStorage: LocalStorageService,
              private apiCall: ApiCallService,
              private geocoder: GeocodingService,
           ) {}

  getWaitTypeList() :Observable<any>{
      if(isLoggedIn){
          return this.apiCall.getResponse('wait_type_list', '' );
         }
    }
   getPassengerValidateVoucher(amount, voucherCode) :Observable<any>{
        let data = {
            iPassengerId:'',
            vVoucherCode:'',
            fAmount:'',
            dSourceLatitude:'',
            dSourceLongitude:'',
            dDestinationLatitude:'',
            dDestinationLongitude:''
        }
        if(isLoggedIn){
            this.user = this.localStorage.getItem('user');
            data.iPassengerId = (this.user.data[0].iPassengerId).toString();
            this.geocoder.getMarkers();
            return this.apiCall.getResponse('passenger_validate_voucher', data );
        }
    }
}
