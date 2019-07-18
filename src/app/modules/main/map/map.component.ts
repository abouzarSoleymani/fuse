import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    Inject,
    PLATFORM_ID,
    Renderer2,
    ViewEncapsulation
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { icon, latLng, marker, tileLayer} from 'leaflet';
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
declare let L;


@Component({
    selector     : 'map',
    templateUrl  : './map.component.html',
    styleUrls    : ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,

})
export class MapComponent implements OnInit{

    isOnBrowser=false;
    currentmarker;
    pinSourceIconUrl = 'assets/images/map/source.png';
    pinDestination1IconUrl = 'assets/images/map/destination1.png';
    pinDestination2IconUrl = 'assets/images/map/destination2.png';
    shadowUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png';

    constructor(private geocoder: GeocodingService,
                @Inject(PLATFORM_ID) private platformId: Object,
                private http: HttpClient,
                private renderer: Renderer2,
                private _fuseConfigService: FuseConfigService,
                private _fuseSidebarService: FuseSidebarService,
                private apiCall: ApiCallService,
                private localStorage: LocalStorageService,
                private errorDialog: ErrorDialogService) {

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

    @Output('setAddressData') setAddressData = new EventEmitter<any>();
    @Output('clickOnMarker') clickOnMarker = new EventEmitter<any>();

    address;
    map;
    mapCenter;
    vehicleType: any[] = [];
    user: ResponseApiModel<any>;

    currentLocationIconUrl = 'assets/images/map/my_location_icon.png';


    mapZoom={animate:true};
    selectedAddress = {lat: '', lng: '', address: ''};
    markers: any [] = [];
    options = {
        layers: [
            tileLayer('https://api.cedarmaps.com/v1/tiles/cedarmaps.streets/{z}/{x}/{y}.png?access_token=d058bfc14a9d1305de1dbabd7161f67cd2f37933'),
        ],
        zoom: 14,
        center: latLng(35.710106, 51.396511)
    };


    onMapReady(map) {
        this.map = map;
        this.myLocationIcon();

        this.searchCurrentLocation();
        this.addNewMarker(null);
        this.search();
        this.mapMove();
    }
    getCenterMarker(){
        this.currentmarker.setLatLng(this.map.getCenter());
    }
    mapMove(){
        this.map.on('move', (e) => {
            if(!this.geocoder.freezMarkers)
                this.getCenterMarker();
        });

            this.map.on('moveend', (e) =>{
                setTimeout( () => {
                    if(this.geocoder.getMarkers().length == 1){
                        this.getPassengerNearByDriver(this.map.getCenter());
                    }
                }, 2000)
            })


    }
    addNewMarker(location){
                let iconUrl;
                console.log(this.geocoder.getMarkers().length)
                let latlng = location == null ||  location == undefined ? '': location;
                //  if(!this.isFreeMarker()){
                if(this.geocoder.getMarkers().length === 0)
                iconUrl =  this.pinSourceIconUrl;
                else if(this.geocoder.getMarkers().length === 1)
                iconUrl = this.pinDestination1IconUrl;

                console.log(iconUrl, latlng)
                this.createMarker(iconUrl, latlng);
                // }
                //   if(!this.isFreeMarker())

    }


    isFreeMarker(){
        if(this.geocoder.getMarkers().length < 2 ){

            //  this.routing();
            return true;
        }
        return false;
    }

    createMarker(iconUrl, location){
        console.log(iconUrl, location)
        const newMarker = marker(
            this.geocoder.getMarkers().length == 0 ? this.map.getCenter(): [ location.lat , location.lng],
            {
                interactive: true,
                draggable: false,
                icon: icon({
                    className: 'pin',
                    iconSize: [ 25, 41 ],
                    iconAnchor: [10, 10],
                    iconUrl: iconUrl,
                    shadowUrl: this.shadowUrl,
                })
            }
        ).on('click', (event: any) => {
            if(this.isFreeMarker()) {
                this.addNewMarker(event.latlng)
            }else{
                this.geocoder.freezMarkers = true;
                    this.fitBound();
                    this.statusFooter();
            }

        })
        this.geocoder.setMarker(newMarker);
        console.log(this.geocoder.getMarkers())
        this.currentmarker = this.geocoder.getMarkers()[this.geocoder.getMarkers().length - 1];
        console.log(this.currentmarker)
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
                .addListener(div, 'click', L.DomEvent.preventDefault)
            div.id = 'my-location';
            return div;
        };
        pin.addTo(this.map);

        let pinId = document.getElementById('my-location');
        this.renderer.listen(pinId, 'click', (event) => {
            this.searchCurrentLocation();
        })
    }


    ngOnInit(): void {
        console.log(this.geocoder.getClientLocation());
        this.geocoder.markerss.subscribe(
            (data: any) =>{
                console.log(data)
                this.markers = data;
                this.geocoder.freezMarkers = false;
            }
        )
        this.geocoder.isUnfreezMarkers.subscribe(
            (data) =>{
                console.log(data)
                this.getCenterMarker();
            }
        )
        console.log(this._fuseSidebarService.getSidebar('navbar'))
        setTimeout( () => {
            this._fuseSidebarService.getSidebar('navbar').toggleFold();
        } , 500)
    }

    getPassengerNearByDriver(latLng){
        let data = {
            "iPassengerId": "",
            "dSourceLatitude": latLng.lat,
            "dSourceLongitude": latLng.lng
        }

        if(isLoggedIn){
            this.user = this.localStorage.getItem('user');
            data.iPassengerId = (this.user.data[0].iPassengerId).toString();
            this.apiCall.getResponse('passenger_near_by_drivers', data).subscribe(
                (data) =>{
                    this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                    console.log(data.data[0].vehicle_type)
                    if(data.data[0].vehicle_type && data.data[0].vehicle_type.length > 0) {
                        this.vehicleType = data.data[0].vehicle_type;
                        this.addVehicleToMap();
                    }
                }
            )
        }

    }

    addVehicleToMap(){
            console.log(this.vehicleType)
            console.log(this.vehicleType)
            for (let vehType of this.vehicleType){
                //let icon = veh.vVehicleMapIcon;
                if(vehType.near_by_drivers && vehType.near_by_drivers.length>0)
                for(let vehTypeNear of vehType.near_by_drivers){
                    console.log(vehTypeNear)
                }
            }
    }
    setAddress(location){
        this.http.get(`https://pm2.parsimap.com/comapi.svc/areaInfo/${location.lat}/${location.lng}/18/1/84785dc1-9106-4bd2-a400-770acb187fa4/1`).subscribe(
            (data:any) => {
              //  this.setMarker(location)
                this.setAddressData.emit({lat: location.lat, lng: location.lng, address: data.limitedFullAddress})
                this.selectedAddress.lat = location.lat;
                this.selectedAddress.lng = location.lng;
                this.selectedAddress.address = data.limitedFullAddress;
            }
        )
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
                    this.map.setView(data, 14, {animate: true})
                });
      }




      statusFooter(){
          let config = {layout: {footer : { hidden: false}}};
          this._fuseConfigService.setConfig( config )
      }
      fitBound(){
            let markers = this.geocoder.getMarkers();
          let  bounds = new L.LatLngBounds(markers[0]._latlng, markers[1]._latlng);
          this.map.fitBounds(bounds, {padding: [100, 100]});
      }

    routing() {
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


}