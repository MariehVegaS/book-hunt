import { Component, Input } from '@angular/core';
import { Cover } from 'src/app/models/cover.model';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {

  @Input() slides: Cover[] = [
    { url: "http://placehold.it/350x150/000000" },
    { url: "http://placehold.it/350x150/111111" },
    { url: "http://placehold.it/350x150/333333" },
    { url: "http://placehold.it/350x150/666666" }
  ];

  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: true,
    centerMode: true,
    centerPadding: '20px',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false
        }
      }
    ]
  };


}
