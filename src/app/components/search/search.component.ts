import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  simpleSearchLbl = "Game of thrones...";
  searchTerm: string = '';

  constructor(private router: Router){
  }

  search() {
    // We have to send this the searched value to he results page
    if (this.searchTerm != "") {
      this.router.navigate(['/results'], { queryParams: { q: this.searchTerm } });
    }
  }

}
