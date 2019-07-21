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
    vehicleMarkers: any[] = [];
    address;
    map;
    mapCenter;
    user: ResponseApiModel<any>;
    layerGroupVehicles =  L.layerGroup();
    currentLocationIconUrl = 'assets/images/map/my_location_icon.png';
    pinSourceIconUrl = 'assets/images/map/source.png';
    pinDestination1IconUrl = 'assets/images/map/destination1.png';
    pinDestination2IconUrl = 'assets/images/map/destination2.png';
    shadowUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png';
    mapZoom={animate:true};
    selectedAddress = {lat: '', lng: '', address: ''};
    markers: Marker [] = [];
    options = {
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
                    hidden: false
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }


    onMapReady(map) {
        this.map = map;
        this.myLocationIcon();
        this.layerGroupVehicles.addTo(this.map);

        this.searchCurrentLocation();
        this.geocoder.resetMArkers();
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
        console.log(this.geocoder.getMarkers().length)
        const newMarker = 

            marker(
            this.geocoder.getMarkers().length == 0 ? this.map.getCenter(): [ location.lat , location.lng],
            {
                interactive: true,
                draggable: false,
                icon: icon({
                    className: 'pin',
                    iconSize: [ 50, 70 ],
                    iconAnchor: [25, 70],
                    iconUrl: iconUrl,
                    shadowUrl: this.shadowUrl,
                })
            }
        ).on('click', (event: any) => {
            console.log(this.geocoder.getMarkers()[this.geocoder.getMarkers().length - 1].options)
            if(this.isFreeMarker()) {
                this.geocoder.getMarkers()[this.geocoder.getMarkers().length - 1].setLatLng(event.latlng);

                this.addNewMarker(event.latlng)
            }else{
                this.geocoder.freezMarkers = true;
                    this.fitBound();
                    this.hiddenFooter(false);
                    this.geocoder.estimateFare();
            }

        })
        console.log(this.geocoder.getMarkers())
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
        this.geocoder.markersChanged.subscribe(
            (data: any) =>{
                this.markers = data;
                this.geocoder.freezMarkers = false;
            }
        )
        this.geocoder.isUnfreezMarkers.subscribe(
            (data) =>{
                console.log(data)
                this.getCenterMarker();
                this.hiddenFooter(true);
            }
        )
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
                    this.layerGroupVehicles.clearLayers();
                    this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
                    if(data.data.length>0 && data.data[0].vehicle_type && data.data[0].vehicle_type.length > 0) {
                        this.addVehicleToMap(data.data[0].vehicle_type);
                    }
                }
            )
        }
    }

    addVehicleToMap(vehicleType){
        let vehType
        let vehTypeNear;
        this.vehicleMarkers = [];
        for ( vehType of vehicleType){
                //let icon = veh.vVehicleMapIcon;
                if(vehType.near_by_drivers && vehType.near_by_drivers.length>0){
                    for(vehTypeNear of vehType.near_by_drivers){
                        console.log(vehTypeNear)
                        console.log(vehType.vVehicleMapIcon)
                        this.vehicleMarkers.push(vehTypeNear);
                    }
                    this.vehiclesOnMap(vehType);
                }

            }
/*       this.vehicleMarkers = [
            [35.72634284417815, 51.46245002746583],
            [35.73634284417815, 51.47245002746583],
            [35.70634284417815, 51.44245002746583]
        ];
        for(let vehs of this.vehicleMarkers){
            let i = Math.floor(Math.random() * Math.floor(3));
            vehs[0] = '35.7'+ i+ '634284417815';
                vehs[1] = '51.4'+ i + '245002746583';
                console.log( vehs[0],  vehs[1])
            }*/
         //   console.log(vehTypeNear, vehType)
       // this.vehiclesOnMap(vehTypeNear, vehType)
        //  this.map.setView(data, 14, {animate: true})
    }
    vehiclesOnMap(vehType){
        console.log(vehType)
        console.log(this.layerGroupVehicles)
        console.log(this.vehicleMarkers)
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


   //     [vehTypeNear.fDriverLatitude, vehTypeNear.fDriverLongitude],
   //     iconUrl: vehType.vVehicleMapIcon,

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




      hiddenFooter(status){
          let config = {layout: {footer : { hidden: status}}};
          this._fuseConfigService.setConfig( config )
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


}