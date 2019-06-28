import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {Observable} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }
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
}
