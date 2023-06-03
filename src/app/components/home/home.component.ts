import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(){
    this.imageSize();
  }

  imageSize(){
    let navbar: any = document.getElementsByTagName("nav");
    let navbarHeight: string = (navbar.length > 0) ? navbar[0].offsetHeight + "px" : "0px";
    document.documentElement.style.setProperty('--nav-height', navbarHeight);
    console.log(navbar[0]);
  }
}
