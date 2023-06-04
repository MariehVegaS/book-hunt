import { Component } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  books: Book[] = [];

  constructor(private bookService: BookService) {
    this.bookService.getBooks("The lord of rings").subscribe((res) => {
      console.log(res);
    });
  }

}
