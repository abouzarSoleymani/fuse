import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {ResponseApiModel} from 'app/core/model/responseApi.model';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {FuseConfigService} from '@fuse/services/config.service';
import 'leaflet';
declare let L;
import 'leaflet-rotatedmarker';
import {MarkersChangeService} from 'app/core/service/markersChange.service';


@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private errorDialog: ErrorDialogService,
              private localStorage: LocalStorageService,
              private apiCall: ApiCallService,
              private _fuseConfigService: FuseConfigService,
              private markersChangeService: MarkersChangeService
           ) {
  }
  markers: any [] = [];
  user: ResponseApiModel<any>;
  map;

  currentLocation = {lat: 0, lng: 0};


  getClientLocation(): Observable<any> {
    return new Observable(obs => {
      if (isPlatformBrowser(this.platformId)) {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            if (position) {
              this.currentLocation.lat = position.coords.latitude;
              this.currentLocation.lng = position.coords.longitude;
              obs.next(this.currentLocation);
              obs.complete();
            }
          },
          (error: PositionError) => console.log(error));
      } else {
        alert("Geolocation is not supported by this browser.");
      }
      }
    });
  }



    estimateFare() {

        let data = {
            'iPassengerId': '',
            'dSourceLatitude': this.markersChangeService.getMarkers()[0]._latlng.lat.toString(),
            'dSourceLongitude': this.markersChangeService.getMarkers()[0]._latlng.lng.toString(),
            'dDestinationLatitude': this.markersChangeService.getMarkers()[this.markersChangeService.getMarkers().length - 1]._latlng.lat.toString(),
            'dDestinationLongitude': this.markersChangeService.getMarkers()[this.markersChangeService.getMarkers().length - 1]._latlng.lng.toString(),
        }
        let rideOptions = this.localStorage.getItem('ride');
        if(isLoggedIn){
         //   this.user = this.localStorage.getItem('user');
         //   data.iPassengerId = (this.user.data[0].iPassengerId).toString();
            this.apiCall.getResponse('estimate_fare_all', rideOptions).subscribe(
                (data) => {
                    this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                    this.markersChangeService.getAllVehiclesAvalible(data.data);
                }
            )
        }
    }

}
