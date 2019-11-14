import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    Inject,
    PLATFORM_ID,
    Renderer2,
    ViewEncapsulation, ViewChild, ViewContainerRef, ComponentFactoryResolver
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import {icon, latLng, LatLngExpression, marker, MarkerOptions, tileLayer} from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';
import 'leaflet';
import {GeocodingService} from 'app/core/service/geocoding.service';
import {FuseConfigService} from '@fuse/services/config.service';
import 'leaflet-routing-machine';
import 'leaflet-search';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {consoleTestResultHandler} from 'tslint/lib/test';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {ResponseApiModel} from 'app/core/model/responseApi.model';
import {Marker} from 'app/core/model/marker.model';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {BodyWaitingNearDriverComponent} from 'app/shared/body-waiting-near-driver/body-waiting-near-driver.component';
import {FooterDriverDetailComponent} from 'app/shared/footer-driver-detail/footer-driver-detail.component';
declare let L;
import 'leaflet-rotatedmarker';
import {first} from 'rxjs/operators';
import {BodyDriverScoreComponent} from 'app/shared/body-driver-score/body-driver-score.component';
import {ConfigRideLayoutService} from 'app/core/service/configRideLayout.service';
import {RideStateService} from 'app/core/service/rideState.service';
import {MarkersChangeService} from 'app/core/service/markersChange.service';


@Component({
    selector     : 'map',
    templateUrl  : './map.component.html',
    styleUrls    : ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,

})
export class MapComponent implements OnInit{

    @ViewChild('waitingNearDriver', { read: ViewContainerRef, static: false}) waitingDriverEntry: ViewContainerRef;
    @ViewChild('driverDetail', { read: ViewContainerRef, static: false}) DriverDetailEntry: ViewContainerRef;
    @ViewChild('driverScore', { read: ViewContainerRef, static: false}) DriverScoreEntry: ViewContainerRef;
    componentRef: any;

    isOnBrowser=false;
    currentmarker;
    address;
    map;
    mapCenter;
    user: ResponseApiModel<any>;

    iconImage = 'assets/images/map/source.png';
    mapZoom={animate:true};
    selectedAddress = {lat: '', lng: '', address: ''};
    markers: Marker [] = [];
    options = {
        noMoveStart: true,
        layers: [
            tileLayer('https://api.cedarmaps.com/v1/tiles/cedarmaps.streets/{z}/{x}/{y}.png?access_token=d058bfc14a9d1305de1dbabd7161f67cd2f37933'),
        ],
        zoom: 14,
        center: latLng(35.710106, 51.396511)
    };

    @Output('setAddressData') setAddressData = new EventEmitter<any>();
    @Output('clickOnMarker') clickOnMarker = new EventEmitter<any>();

    constructor(private geocoder: GeocodingService,
                @Inject(PLATFORM_ID) private platformId: Object,
                private http: HttpClient,
                private renderer: Renderer2,
                private _fuseConfigService: FuseConfigService,
                private _fuseSidebarService: FuseSidebarService,
                private apiCall: ApiCallService,
                private localStorage: LocalStorageService,
                private rideStateService: RideStateService,
                private errorDialog: ErrorDialogService,
                private resolver: ComponentFactoryResolver,
                private rideOptionService: RideOptionService,
                private configRideLayoutService: ConfigRideLayoutService,
                private markersChangeService: MarkersChangeService){
        if (isPlatformBrowser(this.platformId)) {
            this.isOnBrowser=true;
        }

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: false
                },
                toolbar  : {
                    hidden: false
                },
                toolbarTravelOptions: {
                  hidden: true
                },
                bodyWaitingNearDriver: {
                    hidden: true
                },
                bodyDriverScore: {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                footerDriverDetail : {
                    hidden: true
                },
                footerDriverOptions : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }


    createDriverScoreComponent() {
        this.DriverScoreEntry.clear();
        const factory = this.resolver.resolveComponentFactory(BodyDriverScoreComponent);
        this.componentRef = this.DriverScoreEntry.createComponent(factory);
    }
    createDriverDetailComponent() {
        this.DriverDetailEntry.clear();
        const factory = this.resolver.resolveComponentFactory(FooterDriverDetailComponent);
        this.componentRef = this.DriverDetailEntry.createComponent(factory);
    }
    createWaitingNearDriverComponent() {
        this.waitingDriverEntry.clear();
        const factory = this.resolver.resolveComponentFactory(BodyWaitingNearDriverComponent);
        this.componentRef = this.waitingDriverEntry.createComponent(factory);
    }
    destroyComponent() {
        this.componentRef.destroy();
    }

    onMapReady(map) {
        this.map = map;
        this.myLocationIcon();
        this.markersChangeService.resetMarkers();
        this.rideStateService.checkState();
        this.markersChangeService.layerGroupVehicles.addTo(this.map);
        this.searchCurrentLocation();
      //  this.addNewMarker(null);
        this.search();
      //  this.mapMove();
        this.mapDragged();

    }
    clickNewMarker(){
        this.markersChangeService.addNewMarker(this.map.getCenter());
        this.markersChangeService.checkStateMarkers();
    }
    getCenterMarker(){
       // this.geocoder.getLastMarker().setLatLng(this.map.getCenter());
    }
/*    mapMove(){
        this.map.on('move', (e) => {
            if(this.geocoder.getMarkers().length == 1)
                this.geocoder.getPassengerNearByDriver(this.map.getCenter());
      })
    }*/
    mapDragged(){
        this.map.on('dragend', (e) => {
             setTimeout( () => {
                if(this.markersChangeService.getMarkers().length == 0){
                    this.markersChangeService.getPassengerNearByDriver(this.map.getCenter());
                }
            }, 2000);
        });
    }



    isFreeMarker(){
        if((this.markersChangeService.getMarkers().length == 2 && this.markersChangeService.thirdMarker == false) || this.markersChangeService.getMarkers().length == 3){
            return false;
        }
        return true;
    }



    changeImageIcon(){
        let rideOptions = this.localStorage.getItem('ride');
        let thirdMarker = rideOptions.secoundDestination;
        if(this.markersChangeService.getMarkers().length == 0){
            this.iconImage = this.markersChangeService.pinSourceIconUrl;
        }
        else if(this.markersChangeService.getMarkers().length == 1){
            this.iconImage = this.markersChangeService.pinDestination1IconUrl;
        }
        else if(this.markersChangeService.getMarkers().length == 2 && thirdMarker){
            this.iconImage = this.markersChangeService.pinDestination2IconUrl;
        }
        else  if((this.markersChangeService.getMarkers().length == 2 && thirdMarker == false ) || this.markersChangeService.getMarkers().length == 3)
        {
            this.iconImage = '';
        }
    }
    myLocationIcon(){
        let pin = L.control({position: 'topleft'});
        pin.onAdd = () => {
            let div = L.DomUtil.create('div');
            div.innerHTML = `
              <div class="leaflet-control-layers leaflet-control-layers-expanded">
                <img class="my-pin" src="assets/images/map/my_location_find.png" >
              </div>`;
            L.DomEvent
                .addListener(div, 'click', L.DomEvent.stopPropagation)
                .addListener(div, 'click', L.DomEvent.preventDefault);
            div.id = 'my-location';
            return div;
        };
        pin.addTo(this.map);

        let pinId = document.getElementById('my-location');
        this.renderer.listen(pinId, 'click', (event) => {
            this.searchCurrentLocation();
        });
    }


    ngOnInit(): void {
/*        this.markersChangeService.changeMapSize.subscribe(
            (data) => {
                if(data)
                this.map.invalidateSize();
            }
        );*/

        this.markersChangeService.markersChanged.subscribe(
            (data: any) => {
                this.markers = this.markersChangeService.getMarkers();
                this.changeImageIcon();
                this.checkMarkerStateFare();
              //  this.markersChangeService.freezMarkers = false;
            }
        );
/*        this.markersChangeService.emitChangePinUrl.subscribe(
            (data: any) => {
                if(data){
                   this.changeImageIcon();
                }
            }
        );*/


/*        this.rideOptionService.emmitAddNewMarker.subscribe(
            (data) => {
                this.markersChangeService.thirdMarker = true;
                this.changeImageIcon();
            }
        );*/

       /* this.rideOptionService.emmitWaiting.subscribe(
            (data) => {
                if(data){
                    console.log(data)
                    this.createWaitingNearDriverComponent();
                }
                else{
                    this.destroyComponent();
                }
            }
        );
        this.rideOptionService.emmitDriverDetail.subscribe(
            (data) => {
                if(data){
                    console.log(data)
                    this.createDriverDetailComponent();
                }
                else{
                    this.destroyComponent();
                }
            }
        );
        this.rideOptionService.emmitDriverScore.subscribe(
            (data) => {
                if(data){

                    this.createDriverScoreComponent();
                }
                else{
                    this.destroyComponent();
                }
            }
        );*/
        setTimeout( () => {
            this._fuseSidebarService.getSidebar('navbar').toggleFold();
        } , 5000);
    }



    checkMarkerStateFare(){
        if(!this.isFreeMarker()){
            // this.markersChangeService.freezMarkers = true;
            this.fitBound();
            this.configRideLayoutService.changeLayoutRideOption(1);
            if(this.markersChangeService.getMarkers().length == 2){
                this.geocoder.estimateFare();
            } else if(this.markersChangeService.getMarkers().length == 3) {
               // this.rideStateService.upDownRideState('down');
                this.rideOptionService.getPassengerEstimateFare();
            }
        }
    }

    setAddress(location){
        this.http.get(`https://pm2.parsimap.com/comapi.svc/areaInfo/${location.lat}/${location.lng}/18/1/84785dc1-9106-4bd2-a400-770acb187fa4/1`).subscribe(
            (data:any) => {
              //  this.setMarker(location)
                this.setAddressData.emit({lat: location.lat, lng: location.lng, address: data.limitedFullAddress});
                this.selectedAddress.lat = location.lat;
                this.selectedAddress.lng = location.lng;
                this.selectedAddress.address = data.limitedFullAddress;
            }
        );
    }

    searchCurrentLocation() {
            this.geocoder.getClientLocation().subscribe(
                (data) =>{
                    marker(
                        [ data.lat , data.lng],
                        {
                            interactive: false,
                            draggable: false,
                            icon: icon( {
                                className: 'currentLocation',
                                iconSize: [ 25, 41 ],
                                iconAnchor: [10, 10],
                                iconUrl:  this.markersChangeService.currentLocationIconUrl,
                            })
                        }
                    ).addTo(this.map);
                    this.map.setView(data, 14, {animate: true});
                });
      }





      fitBound(){
            let markers = this.markersChangeService.getMarkers();
          let  bounds = new L.LatLngBounds(markers[0]._latlng, markers[1]._latlng);
          this.map.fitBounds(bounds, {padding: [100, 100]});
      }

    search(){
        let searchLayer = L.layerGroup().addTo(this.map);
        this.map.addControl( new L.Control.Search({
            position:'topleft',
            url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
            propertyName: 'display_name',
            jsonpParam: 'json_callback',
            propertyLoc: ['lat','lon'],
            layer: searchLayer,
            initial: false,
            autoType: false,
            minLength: 2,
            autoCollapse: true,
        }) );
    }



    ngAfterViewInit(): void {
     //   this.rideOptionService.emmitDriverScore.next(true);
  //      this.rideOptionService.emmitWaiting.next(true);
    //    this.rideOptionService.emmitDriverDetail.next(true);
   //     this.rideOptionService.openDialogTravelOptions();
    }


}