import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  showMenu: boolean = false;
  isHome: boolean =  false;
  homeRoutes: Array<String> = ['/', '/home']

  constructor(private router: Router){
    
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.validateRoute();
      }
    });
  }

  toggleNavbar(){
    this.showMenu = !this.showMenu;
  }

  validateRoute(){
    this.homeRoutes.forEach(route => {
      if (window.location.pathname === route) {
        this.isHome = true;
        return;
      } else {
        this.isHome = false;
      }
    });
  }
}
