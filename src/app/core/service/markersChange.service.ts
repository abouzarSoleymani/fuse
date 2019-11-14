import {Injectable} from '@angular/core';
import 'leaflet-rotatedmarker';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {FuseConfigService} from '@fuse/services/config.service';
import {icon, LatLngExpression, marker} from 'leaflet';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {BehaviorSubject, Subject} from 'rxjs';
import {ResponseApiModel} from 'app/core/model/responseApi.model';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {RideStateService} from 'app/core/service/rideState.service';
declare let L;


@Injectable({
    providedIn: 'root'
})
export class MarkersChangeService {

    emitChangePinUrl = new Subject();
    markersChanged = new Subject();
    changeMapSize = new BehaviorSubject('');
    allVehiclesAvalible = new Subject();
    thirdMarker = false;
    iconPinUrl = 'assets/images/map/source.png';
    markers: any [] = [];
    layerVehicle =  L.layerGroup();
    layerGroupVehicles =  L.layerGroup();
    vehicleMarkers: any[] = [];
    user: ResponseApiModel<any>;
    shadowUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png';
    currentLocationIconUrl = 'assets/images/map/my_location_icon.png';
    pinSourceIconUrl = 'assets/images/map/source.png';
    pinDestination1IconUrl = 'assets/images/map/destination1.png';
    pinDestination2IconUrl = 'assets/images/map/destination2.png';
    locations = [];
    freezMarkers = false;
    isUnfreezMarkers = new Subject();

    constructor(private localStorage: LocalStorageService,
                private _fuseConfigService: FuseConfigService,
                private errorDialog: ErrorDialogService,
                private apiCall: ApiCallService,
                private rideStateService: RideStateService) {
    }

    getLastMarker(){
        return this.getMarkers()[this.getMarkers().length - 1]
    }
    popMarker(){
        this.markers.pop();
    }

    resetMarkers(){
        this.markers =  [];
        this.layerGroupVehicles.clearLayers();
    }
    resetVehicleMarkers(){
        this.layerGroupVehicles.clearLayers();
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
    getAllVehiclesAvalible(vehicles){
        this.allVehiclesAvalible.next(vehicles);
    }
    popLocation(){
        this.locations.pop();
    }

    setMarker(newMarker){
        this.markers.push(newMarker);
        this.setLocations(newMarker._latlng);
        this.markersChanged.next(true);
    }
    checkStateMarkers(){
        let rideOptions = this.localStorage.getItem('ride');
        let thirdMarker = rideOptions.secoundDestination;
        if(this.getMarkers().length == 1) {
            this.rideStateService.upDownRideState(1);
        }else  if(this.getMarkers().length == 2 || this.getMarkers().length == 3) {
            if(thirdMarker && this.getMarkers().length == 2 )
                this.rideStateService.upDownRideState(3);
            else
                this.rideStateService.upDownRideState(2);
        }
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

    addNewMarker(location){

        let iconUrl;
        let latlng = location;

        if(this.getMarkers().length === 0) {
            iconUrl = this.pinSourceIconUrl;
        }
        else if(this.getMarkers().length === 1){
            iconUrl = this.pinDestination1IconUrl;
        }
        else if(this.getMarkers().length == 2){
            iconUrl = this.pinDestination2IconUrl;
        }
        this.createMarker(iconUrl, latlng);
    }

    createMarker(iconUrl, location){
        const newMarker =
            marker(
                [ location.lat , location.lng],
                {
                    interactive: true,
                    draggable: false,
                    icon: icon({
                        className: 'pin',
                        iconSize: [ 50, 70 ],
                        iconAnchor: [25, 70],
                        iconUrl: iconUrl,
                    })
                }
            );
        this.setMarker(newMarker);
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


}