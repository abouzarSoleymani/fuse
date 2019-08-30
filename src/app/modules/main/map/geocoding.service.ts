import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {icon, LatLngExpression, marker} from 'leaflet';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {FuseConfigService} from '@fuse/services/config.service';
declare let L;
import 'leaflet-rotatedmarker';


@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private errorDialog: ErrorDialogService,
              private localStorage: LocalStorageService,
              private apiCall: ApiCallService,
              private _fuseConfigService: FuseConfigService
           ) {
  }
  markers: any [] = [];
  locations = [];
  layerGroupVehicles =  L.layerGroup();
  layerVehicle =  L.layerGroup();
  vehicleMarkers: any[] = [];
  user: ResponseApiModel<any>;
  map;
  thirdMarker = false;
  iconPinUrl = 'assets/images/map/source.png';
  emitChangePinUrl = new Subject();
  markersChanged = new Subject();
  changeMapSize = new BehaviorSubject('');
  allVehiclesAvalible = new Subject();
  freezMarkers = false;
  isUnfreezMarkers = new Subject();
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


  getMarkers(){
      return this.markers;
  }
  setIconPinUrl(){
      this.emitChangePinUrl.next(true);
  }
  getLocations(){
      return this.locations;
  }
  setLocations(latlng){
      if(this.getMarkers().length == 1){
          this.localStorage.updateItem('ride', { dSourceLatitude: latlng.lat.toString()});
          this.localStorage.updateItem('ride',{ dSourceLongitude: latlng.lng.toString()});
      }
      if(this.getMarkers().length == 2){
          this.localStorage.updateItem('ride',{ dDestinationLatitude: latlng.lat.toString()});
          this.localStorage.updateItem('ride',{ dDestinationLongitude: latlng.lng.toString()});
      }
      if(this.getMarkers().length == 3) {
          this.localStorage.updateItem('ride',{ dDestinationLatitude2: latlng.lat.toString()});
          this.localStorage.updateItem('ride',{ dDestinationLongitude2: latlng.lng.toString()});
      }
      this.locations.push(latlng);
  }
  setMarker(newMarker){
      this.markers.push(newMarker);
      this.setLocations(newMarker._latlng);
      this.markersChanged.next(true)
  }
  getLastMarker(){
      return this.getMarkers()[this.getMarkers().length - 1]
  }
  popMarker(){
      this.markers.pop();
  }
  popLocation(){
      this.locations.pop();
  }
    resetMarkers(){
      this.markers =  [];
      this.layerGroupVehicles.clearLayers();
    }
    resetVehicleMarkers(){
        this.layerGroupVehicles.clearLayers();
    }
    backStateMap(){
      let rideOptions = this.localStorage.getItem('ride');
      let state = rideOptions.choiseState
      if(state == 0 )
      return;
      if(state == 1){
          this.upDownRideState('down');
          this.localStorage.updateItem('ride', { dSourceLatitude: ''});
          this.localStorage.updateItem('ride',{ dSourceLongitude: ''});
          this.popMarker();
          this.emitChangePinUrl.next(true);
        //  this.isUnfreezMarkers.next(true);
         // this.getMarkers()[this.getMarkers().length-1].setLatLng()
       //   this.locations = [];
          return;
      }
      if(state == 2){
          this.upDownRideState('down');
          this.localStorage.updateItem('ride',{ dDestinationLatitude: ''});
          this.localStorage.updateItem('ride',{ dDestinationLongitude: ''});
          this.hiddenFooter(true)
          this.popMarker();
          this.emitChangePinUrl.next(true);

          // this.isUnfreezMarkers.next(true);
        //  this.popLocation();
          return;
      }
        if(state == 3){
            this.upDownRideState('down');
            this.localStorage.updateItem('ride',{ dDestinationLatitude2: ''});
            this.localStorage.updateItem('ride',{ dDestinationLongitude2: ''});
            this.popMarker();
            this.emitChangePinUrl.next(true);
            this.thirdMarker = false;

            // this.isUnfreezMarkers.next(true);
            //  this.popLocation();
            return;
        }

     // this.freezMarkers = false;
     // this.isUnfreezMarkers.next(true)
     // this.getMarkers()[this.getMarkers().length-1].setLatLng()
    //  this.addNewMarker(null, this.map);

  }
    estimateFare() {

        let data = {
            'iPassengerId': '',
            'dSourceLatitude': this.getMarkers()[0]._latlng.lat.toString(),
            'dSourceLongitude': this.getMarkers()[0]._latlng.lng.toString(),
            'dDestinationLatitude': this.getMarkers()[this.getMarkers().length - 1]._latlng.lat.toString(),
            'dDestinationLongitude': this.getMarkers()[this.getMarkers().length - 1]._latlng.lng.toString(),
        }
        let rideOptions = this.localStorage.getItem('ride');
        if(isLoggedIn){
         //   this.user = this.localStorage.getItem('user');
         //   data.iPassengerId = (this.user.data[0].iPassengerId).toString();
            this.apiCall.getResponse('estimate_fare_all', rideOptions).subscribe(
                (data) => {
                    this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                    this.getAllVehiclesAvalible(data.data);
                }
            )
        }
    }
    getAllVehiclesAvalible(vehicles){
       this.allVehiclesAvalible.next(vehicles);
    }

    upDownRideState(type){
      let rideStatesModel = this.localStorage.getItem('ride');
      let state =  rideStatesModel.choiseState;
      if(type == 'up')
          state = state+1;
      else if(type == 'down')
          state = state-1;
      this.localStorage.updateItem('ride', {choiseState: state})
    }
    hiddenFooter(status){
        let config = {layout: {footer : { hidden: status}}};
        this._fuseConfigService.setConfig( config );
        // this.geocoder.changeMapSize.next(true);
    }


    getPassengerNearByDriver(latLng){
        let data = {
            'iPassengerId': '',
            'dSourceLatitude': latLng.lat,
            'dSourceLongitude': latLng.lng
        };

        if(isLoggedIn){
            this.user = this.localStorage.getItem('user');
            data.iPassengerId = (this.user.data[0].iPassengerId).toString();
            this.apiCall.getResponse('passenger_near_by_drivers', data).subscribe(
                (data) =>{
                    this.layerGroupVehicles.clearLayers();
                    this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                    if(data.data.length>0 && data.data[0].vehicle_type && data.data[0].vehicle_type.length > 0) {
                        this.addVehicleToMap(data.data[0].vehicle_type);
                    }
                }
            );
        }
    }

    addVehicleToMap(vehicleType){
        let vehType;
        let vehTypeNear;
        this.vehicleMarkers = [];
        for ( vehType of vehicleType){
            if(vehType.near_by_drivers && vehType.near_by_drivers.length>0){
                for(vehTypeNear of vehType.near_by_drivers){
                    this.vehicleMarkers.push(vehTypeNear);
                }
                this.vehiclesOnMap(vehType);
            }

        }
    }
    addVehicleOnRouteOnMap(vehicle){
      let newMarker;
      let carMarker: any;
        this.layerVehicle.clearLayers();
/*        dtDateTime: "2019-8-15 15:27:4"
        eRequestStatus: "Inprogress"
        eRideRequestForm: "Online"
        eRideStatus: "DriverEnroute"
        fLatitude: "35.7285658"
        fLongitude: "51.4646258"
        vDriverDirection: "15.467759"*/
       // console.log(marker)
        carMarker = this.getMarkers().filter((mark) => {
            {
                return mark.options.title == 'car';
            }
        })
        if(carMarker == null || carMarker == '' || carMarker == undefined ){
            newMarker = marker(
                [vehicle.fLatitude, vehicle.fLongitude],
                {
                    title: 'car',
                    interactive: false,
                    draggable: false,
                    rotationAngle: vehicle.vDriverDirection,
                    icon: icon({
                        className: 'vehicle-icon',
                        iconSize: [25, 40],
                        iconAnchor: [12, 45],
                         iconUrl: 'http://minetaxi.ir/portal/web/uploads/vehicle_type/5be7c6f78fcaa.png',
                    })
                }
            );
            this.setMarker(newMarker)
        }else{
            let latLng: LatLngExpression = {lat: vehicle.fLatitude, lng: vehicle.fLongitude};
            carMarker[0].setLatLng(latLng);
        }
    }

    vehiclesOnMap(vehType){
         for (let i = 0; i < this.vehicleMarkers.length; i++) {
            var markers = marker(
                [this.vehicleMarkers[i].fDriverLatitude, this.vehicleMarkers[i].fDriverLongitude],
                {
                    interactive: false,
                    draggable: false,
                    icon: icon({
                        className: 'vehicle-icons',
                        iconSize: [25, 40],
                        iconAnchor: [12, 45],
                        iconUrl: vehType.vVehicleMapIcon,
                    })
                }
            );
            this.layerGroupVehicles.addLayer(markers);
        }
    }
}
