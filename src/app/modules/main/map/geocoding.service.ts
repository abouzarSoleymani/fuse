import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {Observable, Subject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {icon, marker} from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private errorDialog: ErrorDialogService,
              private localStorage: LocalStorageService,
              private apiCall: ApiCallService
           ) {
  }
  markers: any [] = [];
  user: ResponseApiModel<any>;
  map;
  markersChanged = new Subject();
  allVehiclesAvalible = new Subject();
  freezMarkers = false;
  isUnfreezMarkers = new Subject();
  location = {lat: 0, lng: 0};
  getClientLocation(): Observable<any> {
    return new Observable(obs => {
      if (isPlatformBrowser(this.platformId)) {
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            if (position) {
              this.location.lat = position.coords.latitude;
              this.location.lng = position.coords.longitude;
              obs.next(this.location);
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


  getMarkers(){
      return this.markers;
  }
  setMarker(newMarker){
      this.markers.push(newMarker);
      this.markersChanged.next(this.markers)
  }
  resetMArkers(){
      this.markers =  [];
  }
  unFreezMarker(){
      this.freezMarkers = false;
      this.isUnfreezMarkers.next(true)
     // this.getMarkers()[this.getMarkers().length-1].setLatLng()
      //console.log(this.map)
    //  this.addNewMarker(null, this.map);

  }
    estimateFare() {

        console.log(this.getMarkers())
        let data = {
            'iPassengerId': '',
            'dSourceLatitude': this.getMarkers()[0]._latlng.lat.toString(),
            'dSourceLongitude': this.getMarkers()[0]._latlng.lng.toString(),
            'dDestinationLatitude': this.getMarkers()[this.getMarkers().length - 1]._latlng.lat.toString(),
            'dDestinationLongitude': this.getMarkers()[this.getMarkers().length - 1]._latlng.lng.toString(),
        }
        if(isLoggedIn){
            this.user = this.localStorage.getItem('user');
            data.iPassengerId = (this.user.data[0].iPassengerId).toString();
            this.apiCall.getResponse('estimate_fare_all', data).subscribe(
                (data) => {
                    console.log(data)
                    this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                    this.getAllVehiclesAvalible(data.data);
                }
            )
        }
    }
    getAllVehiclesAvalible(vehicles){
      console.log('ssss')
       this.allVehiclesAvalible.next(vehicles);
    }




}
