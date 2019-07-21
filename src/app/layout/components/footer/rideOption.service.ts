import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RideOptionService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private errorDialog: ErrorDialogService,
              private localStorage: LocalStorageService,
              private apiCall: ApiCallService
           ) {}

  getWaitTypeList() :Observable<any>{
      if(isLoggedIn){
          return this.apiCall.getResponse('wait_type_list', '' );
         }
    }
}
