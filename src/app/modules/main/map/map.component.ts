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
declare let L;


@Component({
    selector     : 'map',
    templateUrl  : './map.component.html',
    styleUrls    : ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MapComponent implements OnInit{

    isOnBrowser=false;
    showSelectedMarker=false;


    constructor(private geocoder: GeocodingService,
                @Inject(PLATFORM_ID) private platformId: Object,
                private http: HttpClient,
                private renderer: Renderer2,
                private _fuseConfigService: FuseConfigService) {


        if (isPlatformBrowser(this.platformId)) {
            this.isOnBrowser=true;
        }

        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                   folded : true,
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
    pinIconUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png';
    currentLocationIconUrl = 'assets/images/map/my_location_icon.png';
    mapZoom={animate:true};
    mapLoaded = false;
    selectedAddress = {lat: '', lng: '', address: ''};
    markers: any [] = [];
    options = {
        layers: [
            tileLayer('https://pm2.parsimap.com/comapi.svc/tile/parsimap/{x}/{y}/{z}/84785dc1-9106-4bd2-a400-770acb187fa4'),
        ],
        zoom: 8,
        center: latLng(35.710106, 51.396511)
    };


    onMapReady(map) {
        // get a local reference to the map as we need it later


        this.map = map;
        this.mapLoaded = true;
        this.searchLocation();
        this.myLocationPin(map);


        // Add in a crosshair for the map
        const crosshairIcon = L.icon({
            iconUrl: 'assets/images/map/source.png',
            iconSize:     [20, 20], // size of the icon
            iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
        });
        const crosshair = new L.marker(map.getCenter(), {icon: crosshairIcon, clickable:false});
        crosshair.addTo(map);


        map.on('move', function(e) {
            crosshair.setLatLng(map.getCenter());
        });
    }

    myLocationPin(map){
        let pin = L.control({position: 'topleft'});
        pin.onAdd = function (map) {
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
        pin.addTo(map);

        let pinId = document.getElementById('my-location');
        this.renderer.listen(pinId, 'click', (event) => {
            this.searchLocation();
        })
    }

    emitnClickMarker(){
        this.clickOnMarker.emit(true);
    }
    ngOnInit(): void {
        console.log(this.geocoder.getClientLocation());
    }


    setMarker(location) {

        this.renderMarker('pin', location)

    }
    renderMarker(type, location){
        console.log(type, location)
        let iconUrl;
        let shadowUrl;
        let m:any;
        if(type == 'pin'){
            iconUrl =  this.pinIconUrl;
            shadowUrl = "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png";
        }
        else if(type == 'currentLocation') {
            iconUrl = this.currentLocationIconUrl;
        }

        const newMarker = marker(
            [ location.lat , location.lng],
            {
                icon: icon({
                    iconSize: [ 25, 41 ],
                    iconAnchor: [ 13, 41 ],
                    iconUrl: iconUrl,
                    shadowUrl: shadowUrl,
                })
            }
        ).on('click', () => {
            this.emitnClickMarker();
        })

        let commited = false;
        if(this.markers.length == 0){
            this.markers.push(newMarker);
            commited = true
        }else{
            for(let i=0; i<this.markers.length; i++){
                if(this.markers[i].options.icon.options.iconUrl == iconUrl) {
                    this.markers[i] = newMarker;
                    commited = true
                }
            }
            console.log(commited)
            if(commited==false)
                this.markers.push(newMarker);
        }

        this.mapCenter = latLng(location.lat, location.lng);
        setTimeout(() => {this.map.setZoom(14)},400)
    }


    setCurrentLocation(location) {
        this.renderMarker('currentLocation',location);
    }





    setAddress(location){
        this.http.get(`https://pm2.parsimap.com/comapi.svc/areaInfo/${location.lat}/${location.lng}/18/1/84785dc1-9106-4bd2-a400-770acb187fa4/1`).subscribe(
            (data:any) => {
                this.setMarker(location)
                this.setAddressData.emit({lat: location.lat, lng: location.lng, address: data.limitedFullAddress})
                this.selectedAddress.lat = location.lat;
                this.selectedAddress.lng = location.lng;
                this.selectedAddress.address = data.limitedFullAddress;
            }
        )
    }
    cleanMap(){
        this.markers=[];
        this.selectedAddress = {lat: '', lng: '', address: ''};
    }
    leafletClick(event){
        this.showSelectedMarker=true;
        this.setAddress(event.latlng);
    }
    searchLocation(){
        if(this.mapLoaded){
            this.geocoder.getClientLocation().subscribe(
                (data) =>{
                    this.setCurrentLocation(data);

                }
            )
        }
    }


}