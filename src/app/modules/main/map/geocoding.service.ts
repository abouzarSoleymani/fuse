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
           ) {
  }
  markers: any [] = [];
  calcPrice;
  map;
  vehicleType;
  markerss = new Subject();
  currentmarker;
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
      this.markerss.next(this.markers)
  }
  unFreezMarker(){
      this.freezMarkers = false;
      this.isUnfreezMarkers.next(true)
     // this.getMarkers()[this.getMarkers().length-1].setLatLng()
      //console.log(this.map)
    //  this.addNewMarker(null, this.map);

  }





}
