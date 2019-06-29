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
import {computeMsgId} from '@angular/compiler/src/i18n/digest';
import 'leaflet-routing-machine';
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
    calcPrice = false;

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
    currentmarker;
    pinSourceIconUrl = 'assets/images/map/source.png';
    pinDestination1IconUrl = 'assets/images/map/destination1.png';
    pinDestination2IconUrl = 'assets/images/map/destination2.png';
    currentLocationIconUrl = 'assets/images/map/my_location_icon.png';
    shadowUrl = 'https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png';

    mapZoom={animate:true};
    selectedAddress = {lat: '', lng: '', address: ''};
    markers: any [] = [];
    options = {
        layers: [
            tileLayer('https://pm2.parsimap.com/comapi.svc/tile/parsimap/{x}/{y}/{z}/84785dc1-9106-4bd2-a400-770acb187fa4'),
        ],
        zoom: 14,
        center: latLng(35.710106, 51.396511)
    };


    onMapReady(map) {

        this.map = map;
        this.myLocationIcon();

        this.searchCurrentLocation();
        this.addNewMarker(null);
      //  this.getMyLocation();
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
         //   this.getMyLocation();
            this.searchCurrentLocation();
        })
    }


    ngOnInit(): void {
        console.log(this.geocoder.getClientLocation());
    }


    createMarker(iconUrl, location){
        console.log(iconUrl)
        const newMarker = marker(
            this.markers.length == 0 ? this.map.getCenter(): [ location.lat , location.lng],
            {
                icon: icon({
                    iconSize: [ 25, 41 ],
                    iconAnchor: [10, 10],
                    iconUrl: iconUrl,
                    shadowUrl: this.shadowUrl,
                })
            }
        ).on('click', (event: any) => {
            this.addNewMarker(event.latlng)
        })
            this.markers.push(newMarker);
        console.log(this.markers)
            this.currentmarker = this.markers[this.markers.length - 1];

        //  this.mapCenter = latLng(location.lat, location.lng);
      //  setTimeout(() => {this.map.setZoom(14)},400)
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
                            icon: icon({
                                iconSize: [ 25, 41 ],
                                iconAnchor: [10, 10],
                                iconUrl:  this.currentLocationIconUrl,
                            })
                        }
                    ).addTo(this.map);
                    this.map.setView(data, 14, {animate: true})
                });
      }


      addNewMarker(location){
        console.log(location)
          let iconUrl;
          let latlng = location == null ||  location == undefined ? '': location;
          if(this.markers.length < 2){
              if(this.markers.length === 0)
                  iconUrl =  this.pinSourceIconUrl;
              else if(this.markers.length === 1)
                  iconUrl = this.pinDestination1IconUrl;
              this.createMarker(iconUrl, latlng);
          }else{
             this.calcPrice = true;
             this.routing();
          }
          this.map.on('move', (e) => {
              if(this.calcPrice == false)
              this.currentmarker.setLatLng(this.map.getCenter());
          });

       //   if(this.markers.length == 0){
       //     }
/*          const firstIconMarker = L.icon({
              iconUrl: this.pinSourceIconUrl,
              iconSize:     [20, 20], // size of the icon
              iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
          });
          this.currentmarker = new L.marker(map.getCenter(), {icon: firstIconMarker, clickable:false}).on('click', (event) => {
              this.setMarker(event)
          })

          this.currentmarker.addTo(map);*/


      }

    routing(){
        console.log(this.markers[0]._latlng)
        console.log(this.markers[1]._latlng)
        const router = new L.Routing.OSRMv1({
            serviceUrl: 'https://pm2.parsimap.com/comapi.svc'
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











    emitnClickMarker(){
        this.clickOnMarker.emit(true);
    }


/*    cleanMap(){
        this.markers=[];
        this.selectedAddress = {lat: '', lng: '', address: ''};
    }*/


    /*    leafletClick(event){
            this.showSelectedMarker=true;
            this.setAddress(event.latlng);
        }*/

      getMyLocation(){
          this.map.on('locationfound', (e) => {
              this.onLocationFound(e);
          });
          this.map.on('locationerror', (e) => {
              this.onLocationError(e);
          });
          this.map.locate({setView: true, watch: true, maxZoom: 32 , enableHighAccuracy: true, maximumAge: 60000});
          setTimeout(() => {this.map.setZoom(14)},400)

      }
     onLocationFound(e) {
        marker(
             [ e.latlng.lat , e.latlng.lng],
             {
                 icon: icon({
                     iconSize: [ 25, 41 ],
                     iconAnchor: [10, 10],
                     iconUrl:  this.currentLocationIconUrl,
                 })
             }
         ).addTo(this.map);
       // const radius = e.accuracy / 2;
     //   L.marker(e.latlng).addTo(this.map)
          //  .bindPopup("You are within " + radius + " meters from this point").openPopup();
       // L.circle(e.latlng, radius).addTo(map);
    }
    onLocationError(e){
        alert(e.message)
    }


    private addMarker(e: L.LeafletMouseEvent) {
       // const shortLat = Math.round(e.latlng.lat * 1000000) / 1000000;
      //  const shortLng = Math.round(e.latlng.lng * 1000000) / 1000000;
      //  const popup = `<div>Latitude: ${shortLat}<div><div>Longitude: ${shortLng}<div>`;
        const icon = L.icon({
            iconUrl: this.currentLocationIconUrl,
            shadowUrl:''
        });

        const marker = L.marker(e.latlng, {
            draggable: true,
            icon
        })
 /*           .bindPopup(popup, {
                offset: L.point(12, 6)
            })*/
        //    .addTo(this.map)
         //   .openPopup();

       // marker.on("click", () => marker.remove());
    }
}