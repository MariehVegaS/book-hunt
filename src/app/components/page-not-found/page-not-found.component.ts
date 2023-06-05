import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  constructor() {
    this.imageSize();
  }

  imageSize() {
    let navbar: any = document.getElementsByTagName("nav");
    let navbarHeight: string = (navbar.length > 0) ? navbar[0].offsetHeight + "px" : "0px";
    document.documentElement.style.setProperty('--nav-height', navbarHeight);
  }
}
