import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu: boolean = false;
  isHome: boolean =  false;
  homeRoutes: Array<String> = ['/', '/home']

  constructor(){
    this.validateRoute();
  }

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }

  validateRoute(){
    this.homeRoutes.forEach(route => {
      if (window.location.pathname === route) {
        this.isHome = true;
        return;
      }
    });
  }
}
