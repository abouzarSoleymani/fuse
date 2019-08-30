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
import {GeocodingService} from 'app/modules/main/map/geocoding.service';
import {FuseConfigService} from '@fuse/services/config.service';
import 'leaflet-routing-machine';
import 'leaflet-search';
import {ApiCallService} from 'app/core/service/apiCall.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {consoleTestResultHandler} from 'tslint/lib/test';
import {isLoggedIn} from 'app/modules/authentication/auth.selectors';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {ResponseApiModel} from 'app/model/responseApi.model';
import {Marker} from 'app/model/marker.model';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {WaitingNearDriverComponent} from 'app/shared/waiting-near-driver/waiting-near-driver.component';
import {DriverDetailComponent} from 'app/modules/main/map/driver-detail/driver-detail.component';
declare let L;
import 'leaflet-rotatedmarker';
import {first} from 'rxjs/operators';
import {DriverScoreComponent} from 'app/modules/main/map/driver-score/driver-score.component';


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
    currentLocationIconUrl = 'assets/images/map/my_location_icon.png';
    pinSourceIconUrl = 'assets/images/map/source.png';
    pinDestination1IconUrl = 'assets/images/map/destination1.png';
    pinDestination2IconUrl = 'assets/images/map/destination2.png';
    shadowUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png';
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
                private errorDialog: ErrorDialogService,
                private resolver: ComponentFactoryResolver,
                private rideOptionService: RideOptionService){
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
                footer   : {
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
        const factory = this.resolver.resolveComponentFactory(DriverScoreComponent);
        this.componentRef = this.DriverScoreEntry.createComponent(factory);
    }
    createDriverDetailComponent() {
        this.DriverDetailEntry.clear();
        const factory = this.resolver.resolveComponentFactory(DriverDetailComponent);
        this.componentRef = this.DriverDetailEntry.createComponent(factory);
    }
    createWaitingNearDriverComponent() {
        this.waitingDriverEntry.clear();
        const factory = this.resolver.resolveComponentFactory(WaitingNearDriverComponent);
        this.componentRef = this.waitingDriverEntry.createComponent(factory);
    }
    destroyComponent() {
        this.componentRef.destroy();
    }

    onMapReady(map) {
        this.map = map;
        this.myLocationIcon();
        this.geocoder.resetMarkers();
        this.checkState();
        this.geocoder.layerGroupVehicles.addTo(this.map);
        this.searchCurrentLocation();
      //  this.addNewMarker(null);
        this.search();
      //  this.mapMove();
        this.mapDragged();
        this.rideOptionService.getIntervalRidePath();

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
                if(this.geocoder.getMarkers().length == 0){
                    this.geocoder.getPassengerNearByDriver(this.map.getCenter());
                }
            }, 2000);
        });
    }
    addNewMarker(location){

            let iconUrl;
            let latlng = location == null ||  location == undefined ? this.map.getCenter(): location;
         //this.geocoder.getLastMarker().setLatLng(latlng);
        if(this.geocoder.getMarkers().length === 0) {
            iconUrl = this.pinSourceIconUrl;
        } else if(this.geocoder.getMarkers().length === 1)
                iconUrl = this.pinDestination1IconUrl;
            else if(this.geocoder.getMarkers().length == 2)
                iconUrl = this.pinDestination2IconUrl;
        this.createMarker(iconUrl, latlng);
        //  if(!this.isFreeMarker()){
        this.geocoder.upDownRideState('up');
        // }
            //   if(!this.isFreeMarker())

    }


    isFreeMarker(){
        if((this.geocoder.getMarkers().length == 2 && this.geocoder.thirdMarker == false) || this.geocoder.getMarkers().length == 3){
            return false;
        }
        return true;
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
                   // shadowUrl: this.shadowUrl,
                })
            }
        );
           //     .on('click', (event: any) => {
                //this.map.invalidateSize()
       /*         if(this.geocoder.getLocations().length < 2 || (this.geocoder.getLocations().length == 2 && this.geocoder.getMarkers().length == 3 )){
                    this.geocoder.upDownRideState('up')
                    this.geocoder.setLocations(event.latlng);
                    this.geocoder.getLastMarker().setLatLng(event.latlng);

                }*/
              //  this.addNewMarker(event.latlng)
      //  })

        this.geocoder.setMarker(newMarker);
        this.changeImageIcon();
        if(!this.isFreeMarker()){
            this.geocoder.freezMarkers = true;
            this.fitBound();
            this.geocoder.hiddenFooter(false);
            if(this.geocoder.getMarkers().length == 2)
                this.geocoder.estimateFare();
            else if(this.geocoder.getMarkers().length == 3)
                this.rideOptionService.getPassengerEstimateFare();
        }
       // this.currentmarker = this.geocoder.getMarkers()[this.geocoder.getMarkers().length - 1];
    }
    changeImageIcon(){
        if(this.geocoder.getMarkers().length == 0){
            this.iconImage = this.pinSourceIconUrl;
        }
        else if(this.geocoder.getMarkers().length == 1){
            this.iconImage = this.pinDestination1IconUrl;
        }
        else if(this.geocoder.getMarkers().length == 2 && this.geocoder.thirdMarker == true){
            this.iconImage = this.pinDestination2IconUrl;
        }
        else  if((this.geocoder.getMarkers().length == 2 && this.geocoder.thirdMarker == false ) || this.geocoder.getMarkers().length == 3)
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

        this.geocoder.changeMapSize.subscribe(
            (data) => {
                if(data)
                this.map.invalidateSize();
            }
        );
        this.geocoder.markersChanged.subscribe(
            (data: any) =>{
                this.markers = this.geocoder.getMarkers();
                this.geocoder.freezMarkers = false;
            }
        );
        this.geocoder.emitChangePinUrl.subscribe(
            (data: any) => {
                if(data){
                   this.changeImageIcon();
                }
            }
        );

/*        this.geocoder.isUnfreezMarkers.subscribe(
            (data) =>{
                if(data){
                   // this.getCenterMarker();
                    this.geocoder.hiddenFooter(true);
                }
            }
        );*/

        this.rideOptionService.emmitAddNewMarker.subscribe(
            (data) => {
                this.geocoder.thirdMarker = true;
               // this.addNewMarker(null);
                this.changeImageIcon();
              //  this.geocoder.isUnfreezMarkers.next(true);
            }
        );
        this.rideOptionService.emmitWaiting.subscribe(
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
        );
        setTimeout( () => {
            this._fuseSidebarService.getSidebar('navbar').toggleFold();
           // this.geocoder.changeMapSize.next(true);
        } , 5000);
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
                            icon: icon({
                                className: 'currentLocation',
                                iconSize: [ 25, 41 ],
                                iconAnchor: [10, 10],
                                iconUrl:  this.currentLocationIconUrl,
                            })
                        }
                    ).addTo(this.map);
                    this.map.setView(data, 14, {animate: true});
                });
      }





      fitBound(){
            let markers = this.geocoder.getMarkers();
          let  bounds = new L.LatLngBounds(markers[0]._latlng, markers[1]._latlng);
          this.map.fitBounds(bounds, {padding: [100, 100]});
      }

/*    routing() {
        const router = new L.Routing.OSRMv1({
            serviceUrl: 'https://api.cedarmaps.com/v1/direction'
        });
        L.Routing.control({
                 router: router,
                createMarker: () => {return null},
                waypoints: [
                    L.latLng(this.markers[0]._latlng.lat, this.markers[0]._latlng.lng),
                    L.latLng(this.markers[1]._latlng.lat, this.markers[1]._latlng.lng),
                ],
                lineOptions: {
                    addWaypoints: false
                },
                collapsible: true,
                show: false,
                routeWhileDragging: true
            }).addTo(this.map);
    }*/

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

    checkState(){
        let rideStatesModel = this.localStorage.getItem('ride');
        if(rideStatesModel.choiseState == 0)
            return;
        if(rideStatesModel.choiseState == 1){
            this.geocoder.setLocations({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
            this.addNewMarker({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
          //  this.geocoder.isUnfreezMarkers.next(true);
        }
        if(rideStatesModel.choiseState == 2){
            this.addNewMarker({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
            this.geocoder.setLocations({lat: rideStatesModel.dSourceLatitude, lng: rideStatesModel.dSourceLongitude});
            this.addNewMarker({lat: rideStatesModel.dDestinationLatitude, lng: rideStatesModel.dDestinationLongitude});
            this.geocoder.setLocations({lat: rideStatesModel.dDestinationLatitude, lng: rideStatesModel.dDestinationLongitude});
        }
    }

    ngAfterViewInit(): void {
     //   this.rideOptionService.emmitDriverScore.next(true);
  //      this.rideOptionService.emmitWaiting.next(true);
    //    this.rideOptionService.emmitDriverDetail.next(true);
   //     this.rideOptionService.openDialogTravelOptions();
    }


}