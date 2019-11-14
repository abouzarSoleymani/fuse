import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {GeocodingService} from 'app/core/service/geocoding.service';
import {RideOptionService} from 'app/core/service/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';
import {LocalStorageService} from 'app/core/service/local-storage.service';
import {FuseConfigService} from '@fuse/services/config.service';
import {MarkersChangeService} from 'app/core/service/markersChange.service';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent implements OnInit
{
    public disabled: boolean = false;
    vehicles;
    @ViewChild('voucherCode', {static: false}) voucherCode: ElementRef;
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
                spaceBetween: 40,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            320: {
                slidesPerView: 2,
                spaceBetween: 10,
            }
        }
    };

    constructor(private geocoder: GeocodingService,
                private rideOptionService: RideOptionService,
                private errorDialog: ErrorDialogService,
                private localStorage: LocalStorageService,
                private _fuseConfigService: FuseConfigService,
                private markerChangesService: MarkersChangeService)
    {
    }

    ngOnInit(): void {



            this.markerChangesService.allVehiclesAvalible.subscribe(
                (data: any) => {
                        this.vehicles = data;
                        if(this.vehicles.length > 0)
                        this.setSelectedVehicle(this.vehicles.find( (data) => {
                            return data.eAllow == 'Yes';
                        }))
                    /*           0:
                eAllow: "Yes"
                eIsDefault: "Yes"
                eVehicleUse: "Taxi"
                iVehicleTypeId: 3
                vAmount: 60000
                vVehicleIcon: "http://minetaxi.ir/portal/web/uploads/vehicle_type/5be7c6f78fbac.png"
                vVehicleName: "اتو ماین"
                1:
                eAllow: "Yes"
                eIsDefault: "No"
                eVehicleUse: "Motor"
                iVehicleTypeId: 6
                vAmount: 75000
                vVehicleIcon: "http://minetaxi.ir/portal/web/uploads/vehicle_type/5be7c748d71b8.png"
                vVehicleName: "موتو ماین"*/
                }
            )

        this.rideOptionService.getFareAmount().subscribe(
            (data) => {
                this.price = data;
            }
        )
    }

    setSelectedVehicle(vehicle){
        this.roundTrip = false;
        this.secondDestination = false;
        this.localStorage.updateItem('ride',{iVehicleTypeId : vehicle.iVehicleTypeId.toString()});
        this.localStorage.updateItem('ride',{eVehicleUse : vehicle.eVehicleUse.toString()});
        this.allowVehicleActived = vehicle;
        this.rideOptionService.setFareAmount(vehicle.vAmount);
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
    checkVoucherInput(){
        let vCode = this.voucherCode.nativeElement.value;
        if(!vCode){
            this.errorDialog.openDialog('لطفا کد تخفیف را وارد نمایید', 2, 'alert');
            return;
        }
        this.rideOptionService.checkVoucher(vCode)
    }
    confirmRide(){
        this.rideOptionService.emmitWaiting.next(true);
        this.rideOptionService.getPassengerConfirmRide().subscribe(
            (data) => {
                if(data.data && data.data.length>0){
                    this.localStorage.updateItem('ride', {iRideRequestId: data.data[0].iRideRequestId.toString()})
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

/*    openChanged(event) {
        this.isOpen = event;
        this.isLoading = event;
/!*        if (event) {
            this.savedValue = this.selected.value;
            this.selected.reset();
        }*!/
    }*/


}
