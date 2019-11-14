import {Injectable, Injector} from '@angular/core';
import 'leaflet-rotatedmarker';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {FuseConfigService} from '@fuse/services/config.service';
import {MarkersChangeService} from 'app/core/service/markersChange.service';
import 'leaflet';
import {ConfigRideLayoutService} from 'app/core/service/configRideLayout.service';
import {RideOptionService} from 'app/core/service/rideOption.service';
declare let L;


@Injectable({
    providedIn: 'root'
})
export class RideStateService {
    private markersChangeService: MarkersChangeService;
    private rideOptionService: RideOptionService;
    constructor(private localStorage: LocalStorageService,
                private _fuseConfigService: FuseConfigService,
                private configRideLayoutService: ConfigRideLayoutService,
                injector: Injector) {
        setTimeout(() => this.markersChangeService = injector.get(MarkersChangeService));
        setTimeout(() => this.rideOptionService = injector.get(RideOptionService));
    }

    backStateMap(){
        let rideOptions = this.localStorage.getItem('ride');
        let state = rideOptions.choiseState;
        if(state == 0 ){
            return;
        } else if(state == 1){
            this.localStorage.updateItem('ride', { dSourceLatitude: ''});
            this.localStorage.updateItem('ride',{ dSourceLongitude: ''});
            this.markersChangeService.popMarker();
            this.markersChangeService.markersChanged.next(true);
            this.upDownRideState(0);
            //  this.isUnfreezMarkers.next(true);
            // this.getMarkers()[this.getMarkers().length-1].setLatLng()
            //   this.locations = [];
            return;
        } else if(state == 2){
            if(rideOptions.dDestinationLatitude2 != '' && rideOptions.dDestinationLongitude2 != ''){
                  this.localStorage.updateItem('ride',{ dDestinationLatitude2: ''});
                  this.localStorage.updateItem('ride',{ dDestinationLongitude2: ''});
                  this.markersChangeService.popMarker();
                  this.markersChangeService.markersChanged.next(true);
                  this.upDownRideState(3);
            }else{
                this.localStorage.updateItem('ride',{ dDestinationLatitude: ''});
                this.localStorage.updateItem('ride',{ dDestinationLongitude: ''});
                this.localStorage.updateItem('ride',{ vSweep: false});
                this.localStorage.updateItem('ride',{ secoundDestination: false});
                this.upDownRideState(1);
                this.markersChangeService.popMarker();
                this.markersChangeService.markersChanged.next(true);
                this.configRideLayoutService.changeLayoutRideOption(0);
            }
            //  this.hiddenFooter(true);
            // this.upDownRideState('down');
            // this.localStorage.updateItem('ride',{ dDestinationLatitude: ''});
           //  this.localStorage.updateItem('ride',{ dDestinationLongitude: ''});


            // this.isUnfreezMarkers.next(true);
            //  this.popLocation();
            return;
        }
        else if(state == 3){
          //  this.localStorage.updateItem('ride',{ dDestinationLatitude2: ''});
          //  this.localStorage.updateItem('ride',{ dDestinationLongitude2: ''});
            this.upDownRideState(2);
            this.localStorage.updateItem('ride', {secoundDestination: false});
            this.markersChangeService.markersChanged.next(true);
            //  this.markersChangeService.thirdMarker = false;
            // this.isUnfreezMarkers.next(true);
            //  this.popLocation();
            return;
        }

        // this.freezMarkers = false;
        // this.isUnfreezMarkers.next(true)
        // this.getMarkers()[this.getMarkers().length-1].setLatLng()
        //  this.addNewMarker(null, this.map);

    }

    upDownRideState(state){
      //  let rideStatesModel = this.localStorage.getItem('ride');
      //  let state =  rideStatesModel.choiseState;
        this.localStorage.updateItem('ride', {choiseState: state})
    }

    hiddenFooter(status){
        let config = {layout: {footer : { hidden: status}}};
        this._fuseConfigService.setConfig( config );
        // this.geocoder.changeMapSize.next(true);
    }

    checkState(){
        let rideStatesModel = this.localStorage.getItem('ride');
        if(rideStatesModel.choiseState == 0)
            return;
        else if(rideStatesModel.choiseState == 1){
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
        }
        else if(rideStatesModel.choiseState == 2){
            this.addMarkerAfterCheck(rideStatesModel)
        }
        else if(rideStatesModel.choiseState == 3){
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dDestinationLatitude, lng: rideStatesModel.dDestinationLongitude});
        }
        else if(rideStatesModel.choiseState == 4){
            this.addMarkerAfterCheck(rideStatesModel);
            this.rideOptionService.getIntervalRidePath();
        }
    }
    addMarkerAfterCheck(rideStatesModel){
        if(rideStatesModel.dDestinationLongitude2 != '' && rideStatesModel.dDestinationLatitude2 != ''){
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dDestinationLatitude2, lng: rideStatesModel.dDestinationLongitude2});
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dDestinationLatitude, lng: rideStatesModel.dDestinationLongitude});
        }else{
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
            this.markersChangeService.addNewMarker({lat: rideStatesModel.dDestinationLatitude, lng: rideStatesModel.dDestinationLongitude});
        }
    }
}