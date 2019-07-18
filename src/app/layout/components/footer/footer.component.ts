import { Component } from '@angular/core';
import {SwiperConfigInterface} from 'ngx-swiper-wrapper';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent
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
        centeredSlides: false,
        pagination: false,
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

    constructor()
    {
    }


}
