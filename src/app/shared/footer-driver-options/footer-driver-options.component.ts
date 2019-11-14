import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {GeocodingService} from 'app/core/service/geocoding.service';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {ConfigRideLayoutService} from 'app/core/service/configRideLayout.service';
import {MarkersChangeService} from 'app/core/service/markersChange.service';
import {RideStateService} from 'app/core/service/rideState.service';

@Component({
  selector: 'footer-driver-options',
  templateUrl: './footer-driver-options.component.html',
  styleUrls: ['./footer-driver-options.component.scss']
})
export class FooterDriverOptionsComponent implements OnInit
{
    public disabled: boolean = false;
    vehicles;
    voucherCode;
    allowVehicleActived;
    rideOptions = false;
    discountOptions = false;
    secondDestination = false;
    roundTrip = false;
    waiting = false;
    waitTypes = [];
    index;
    price;
    isLoading = false;
    @ViewChild('SwiperDirective', { static: false }) directiveRef?: SwiperDirective;

    public config: SwiperConfigInterface = {
        a11y: true,
        direction: 'horizontal',
        slidesPerView: 4,
        spaceBetween: 10,
        keyboard: true,
        mousewheel: true,
        grabCursor: true,
        scrollbar: false,
        navigation: false,
        centeredSlides: true,
        pagination: false,
        slideToClickedSlide: true,
        initialSlide: 0,
        breakpoints: {
            1024: {
                slidesPerView: 4,
                spaceBetween: 0,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 0,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 0,
            },
            320: {
                slidesPerView: 2,
                spaceBetween: 0,
            }
        }
    };

    constructor(private geocoder: GeocodingService,
                private rideOptionService: RideOptionService,
                private errorDialog: ErrorDialogService,
                private localStorage: LocalStorageService,
                private configRideLayout: ConfigRideLayoutService,
                private markersChangeService: MarkersChangeService,
                private rideStateService: RideStateService)
    {
    }

    ngOnInit(): void {
        this.secondDestination = this.rideOptionService.checkSecondDestination();
        console.log(this.secondDestination)
        this.roundTrip = this.rideOptionService.checkRoundTrip();

        this.markersChangeService.markersChanged.subscribe(
            (data: any) => {
                this.secondDestination = this.rideOptionService.checkSecondDestination();
            }
        );

        this.markersChangeService.allVehiclesAvalible.subscribe(
            (data: any) => {
                this.vehicles = data;
                if(this.vehicles.length > 0)
                    this.setSelectedVehicle(this.vehicles.find( (data) => {
                        return data.eAllow == 'Yes';
                    }))
            }
        )
        this.rideOptionService.getFareAmount().subscribe(
            (data) => {
                this.price = data;
            }
        )
        this.initialVoucherCode();
    }

    setSelectedVehicle(vehicle){
        if(vehicle != this.allowVehicleActived){
            this.rideOptions = false;
          //  this.roundTrip = false;
           // this.secondDestination = false;
            this.localStorage.updateItem('ride',{iVehicleTypeId : vehicle.iVehicleTypeId.toString()});
            this.localStorage.updateItem('ride',{eVehicleUse : vehicle.eVehicleUse.toString()});
            this.localStorage.updateItem('ride',{vVoucherCodeConfirmed : false});
            this.allowVehicleActived = vehicle;
            this.rideOptionService.setFareAmount(vehicle.vAmount);
        }
    }
    indexOnChange(event){
        setTimeout( ()=> {
            console.log(this.directiveRef)
        }, 1000)
    }
    setRideOptions(){
        if(this.discountOptions)
            this.discountOptions = !this.discountOptions;
        this.rideOptions = !this.rideOptions;
    }
    setDiscountOptions(){
        if(this.rideOptions)
            this.rideOptions = !this.rideOptions;
        this.discountOptions = !this.discountOptions;
    }
    setSecondDestination(){
        this.secondDestination = !this.secondDestination;
        this.rideOptionService.secondDestination(this.secondDestination);
        this.rideOptions = !this.rideOptions;
    }
    setRoundTrip(){
        this.roundTrip = !this.roundTrip;
        this.localStorage.updateItem('ride', {vSweep: this.roundTrip})
        this.rideOptionService.getPassengerEstimateFare();
    }
    setWaiting(){
        this.waiting = !this.waiting;
    }

    initialVoucherCode(){
        let rideOptions = this.localStorage.getItem('ride');
        this.voucherCode = rideOptions.vVoucherCode;
    }

    checkVoucherInput(){
        let vCode = this.voucherCode;
        this.rideOptionService.checkVoucher(vCode)
    }
    confirmRide(){
        this.configRideLayout.changeLayoutRideOption(2);
        this.rideOptionService.getPassengerConfirmRide().subscribe(
            (data) => {
                if(data.data && data.data.length > 0){
                    this.localStorage.updateItem('ride', {iRideRequestId: data.data[0].iRideRequestId.toString()})
                    this.rideStateService.upDownRideState(4);
                    this.rideOptionService.getIntervalRidePath();
                }
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            })
    }


    getWaitTypesList(){
        this.isLoading = true;
        this.rideOptionService.getWaitTypeList().subscribe(
            (data) => {
                this.isLoading = false;
                this.waitTypes = data.data;
                /*  0:
                    WaitTypeId: 1
                    vDesc: ""
                    vPrice: 5
                    vTitle: "۲ تا ۵ دقیقه"*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            }
        );
    }
    selectedWaitList(event){
        this.localStorage.updateItem('ride', {vWaitType: event.value.WaitTypeId })
        this.rideOptionService.getPassengerEstimateFare()
    }



}
