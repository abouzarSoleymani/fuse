import {Component, OnInit, ViewChild} from '@angular/core';
import {SwiperComponent, SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {GeocodingService} from 'app/modules/main/map/geocoding.service';
import {RideOptionService} from 'app/layout/components/footer/rideOption.service';
import {ErrorDialogService} from 'app/core/service/errordialog.service';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent implements OnInit
{
    public slides = [
        {image: '../../../../assets/images/vehicles/box.png', title: 'موتور ویژه مرسولات'},
        {image: '../../../../assets/images/vehicles/box.png', title: 'موتور ویژه مرسولات'},
        {image: '../../../../assets/images/vehicles/rose.png', title: 'ویژه بانوان'},
        {image: '../../../../assets/images/vehicles/rose.png', title: 'ویژه بانوان'},
        {image: '../../../../assets/images/vehicles/eco.png', title: 'به صرفه و فوری'},
        {image: '../../../../assets/images/vehicles/eco.png', title: 'به صرفه و فوری'},
    ];
    public disabled: boolean = false;
    vehicles;
    allowVehicleActived;
    rideOptions = false;
    discountOptions = false;
    secondDestination = false;
    roundTrip = false;
    waiting = false;
    waitTypes;
    index;
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
                private rideOptionsService: RideOptionService,
                private errorDialog: ErrorDialogService)
    {
    }

    ngOnInit(): void {
        this.rideOptionsService.getWaitTypeList().subscribe(
            (data) => {
                console.log(data);
                this.waitTypes = data.data;
                /*  0:
                    WaitTypeId: 1
                    vDesc: ""
                    vPrice: 5
                    vTitle: "۲ تا ۵ دقیقه"*/
                this.errorDialog.openDialog(data.settings.message, data.settings.success, 'console');
            }
        );

        this.geocoder.allVehiclesAvalible.subscribe(
            (data) =>{
                this.vehicles = data;
                this.allowVehicleActived = this.vehicles.find( (data) => {
                    return data.eAllow == 'Yes';
                })

                console.log(this.allowVehicleActived);
                console.log(this.vehicles)
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

    }

    getPriceEstimate(vehicle){
        this.allowVehicleActived = vehicle;
    }
    indexOnChange(event){
        setTimeout( ()=>{
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
    }
    setRoundTrip(){
        this.roundTrip = !this.roundTrip;
    }
    setWaiting(){
        this.waiting = !this.waiting;
    }
}
