import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDetails } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  bookDetails: BookDetails | undefined;
  linksOpen: boolean = true;
  authorsOpen: boolean = false;
  noInfoFound: string = "No information found.";

  constructor(private bookService: BookService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty("book")) {
        this.bookService.getBookByKey(params['book']).subscribe((results) => {
          this.bookDetails = results;
          console.log(results);
        });
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  toggleLinks(){
    (this.linksOpen) ? this.linksOpen = false : this.linksOpen = true;
  }

  toggleAuthors(){
    (this.authorsOpen) ? this.authorsOpen = false : this.authorsOpen = true;
  }

}
