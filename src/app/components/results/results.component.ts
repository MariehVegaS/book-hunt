import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookResults } from 'src/app/models/results.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  bookResults: BookResults | undefined;
  seeMoreLbl: string = "Ver más";
  noResultsFoundLbl: string = "No results found";
  resultsFoundLbl: string = " results were found for ";
  page: number = 1;

  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty("q")) {
        this.bookService.getBookSimpleSearch(params['q']).subscribe((results) => {
          this.bookResults = results;
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  viewDetails(bookKey: string) {
    // We have to send this the searched value to he results page
    if (bookKey != "") {
      this.router.navigate(['/details'], { queryParams: { book: bookKey } });
    }
  }

}
