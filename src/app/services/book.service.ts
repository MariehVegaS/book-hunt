import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BookResults } from '../models/results.model';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { BookSearched, Work } from '../models/book.model';
import { Doc, MoreInfoUrls } from '../models/api.model';
import { Cover } from '../models/cover.model';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: "root"
})
export class BookService {

  title: string = environment.title;
  private apiUrl: string = environment.booksApi.mainUrl;
  private authorsPath: string = environment.booksApi.authorsApi;
  private connectorParams: string = "&";
  private availableSearchParam: string = environment.booksApi.availableSearchParam;
  private limitSearchParam: string = environment.booksApi.limitSearchParam;
  private coverUrl: string = environment.booksApi.coverUrl;
  private coverType: string = environment.booksApi.coverType;
  private coverSize: string = environment.booksApi.coverSize;
  private jsonType: string = environment.booksApi.jsonType;

  private generalSearchUrl: string = this.apiUrl + environment.booksApi.generalSearch + environment.booksApi.generalSearchKeyParam;

  constructor(private http: HttpClient) { }

  /**
   * Function in charge of get the results by a simple search/query
   * - Returns a observable to make posible use loader in front
   * - To specify get all the possible result enter 0 into param quantity
   * @param query 
   * @param quantity 
   * @returns Observable<BookResults>
   */
  getBookSimpleSearch(query: string, quantity: number = 0): Observable<BookResults> {
    // To specify get all the possible result enter 0 into param quantity
    let apiQuery: string = (quantity === 0) ? this.generalSearchUrl + query + this.connectorParams + this.availableSearchParam : this.generalSearchUrl + query + this.connectorParams + this.availableSearchParam + this.connectorParams + this.limitSearchParam + quantity;
    // We use switchmap to wait for the children observables
    return this.http.get<BookResults>(apiQuery).pipe(switchMap((apiBookResults: any) => {
      // We get all the information and make a destructuration of each result that we need
      let { numFound, docs, q } = apiBookResults;
      let books: BookSearched[] = [];
      // We check if there is a result inside docs 
      if (docs && docs.length > 0) {
        // we set the quantity of the results
        for (let i = 0; i < docs.length; i++) {
          let doc: Doc = docs[i];
          let { key, title, author_name, cover_i } = doc;
          let cover = this.getCoverById(cover_i).url;
          books.push({ workKey: key, title: title, cover: cover, authors: author_name});
        }
      }
      // If there is not docs, we return back a empty response
      return of({ numFound, books, query: q });
    }));
  }

  // getBooks(query: string, quantity: number = 5): Observable<BookResults> {
  //   // We use switchmap to wait for the children observables
  //   return this.http.get<BookResults>(this.generalSearchUrl + query).pipe(switchMap((apiBookResults: BookResults) => {
  //     // We get all the information and make a destructuration of each result that we need
  //     let { numFound, docs } = apiBookResults;
  //     let books: Book[] = [];
  //     // We check if there is a result inside docs 
  //     if (docs && docs.length > 0) {
  //       // We create a variable to save all the request. Related with books
  //       const bookObservables: Observable<Book>[] = [];
  //       // we set the quantity of the results
  //       for (let i = 0; i < quantity; i++) {
  //         let doc: Doc = docs[i];
  //         const bookObservable = this.getWorkByKey(doc.key).pipe(
  //           switchMap((work) => {
  //             // We extract the necessary information for work and doc
  //             let { covers, links, description, first_publish_date } = work;
  //             let { title, number_of_pages_median } = doc;
  //             // We validate if there is information about the autors
  //             if (doc.hasOwnProperty("author_key") && doc.author_key.length > 0) {
  //               // We create a variable to save all the request. Related with authors
  //               const authorObservables: Observable<Author>[] = [];
  //               // We search all the information for each author key
  //               doc.author_key.forEach(authorKey => {
  //                 const authorObservable = this.getAuthorByKey(authorKey).pipe(
  //                   map((author) => {
  //                     // We extract the necessary information for author
  //                     let { photos, name, bio, birth_date, death_date, links } = author;
  //                     return { photos, name, bio, birth_date, death_date, links };
  //                   })
  //                 );
  //                 // We send the observable to the list
  //                 authorObservables.push(authorObservable);
  //               });
  //               // We return the information found
  //               return forkJoin(authorObservables).pipe(
  //                 map((authors: Author[]) => {
  //                   return { title, number_of_pages_median, covers, links, description, first_publish_date, authors };
  //                 })
  //               );
  //             }
  //             // If there is no information about authors, we send an empty array
  //             return of({ title, number_of_pages_median, covers, links, description, first_publish_date, authors: [] });
  //           })
  //         );
  //         // We send the observable to the list
  //         bookObservables.push(bookObservable);
  //       }
  //       // We join all the information
  //       return forkJoin(bookObservables).pipe(
  //         map((bookResults: Book[]) => {
  //           return { numFound, books: bookResults };
  //         })
  //       );
  //     }

  //     // If there is not docs, we return back a empty response
  //     return of({ numFound, books });
  //   }));
  // }

  /**
   * Function in charge of get the work information by key (ex: works/45621SAD)
   * @param key 
   * @param coversQuantity 
   * @returns Observable<Work>
   */
  private getWorkByKey(key: string, coversQuantity?: number): Observable<Work> {
    return this.http.get<Work>(this.apiUrl + key + this.jsonType).pipe(map((work: any) => {
      // Info raw from api
      let { covers, links, description, first_publish_date } = work;
      // Sometimes the description is in an object, not directly a string
      if (typeof description == 'object' && description.hasOwnProperty("value")) {
        description = description.value; // Sometimes the description is in an object, not directly a string
      }
      // To get exactly the quantity of covers that we need
      if (coversQuantity && coversQuantity <= covers.length) {
        const covers2Obtain: Cover[] = []; 
        for (let i = 0; i < coversQuantity; i++) {
          covers2Obtain.push(this.getCoverById(covers[i]));
        }
        covers = covers2Obtain;
      } else {
        covers = this.getCoversByIdArray(covers);
      }
      links = this.getLinksByObjectApi(links);
      // Changing the API data to Interface data
      return { covers, links, description, first_publish_date };
    }));
  }

  /**
   * Create the url for each cover id (ex: 21312412341)
   * @param idsArray 
   * @returns Cover[]
   */
  private getCoversByIdArray(idsArray: number[]): Cover[] {
    let coverUrls: Cover[] = [];
    if (idsArray && idsArray.length > 0) {
      idsArray.forEach(id => {
        coverUrls.push(this.getCoverById(id));
      });
    }
    return coverUrls;
  }

  private getCoverById(id: number): Cover {
    let cover: Cover = { url: "" };
    if (typeof id == 'number') {
      let postiveId = Math.abs(id);
      cover.url = this.coverUrl + postiveId + this.coverSize + this.coverType;
    }
    return cover;
  }

  private getLinksByObjectApi(objectApi: any[]): MoreInfoUrls[] {
    let links: MoreInfoUrls[] = [];
    if (objectApi && objectApi.length > 0) {
      objectApi.forEach(object => {
        // We check if the object has the properties that we're waiting for
        if (object.hasOwnProperty('title') && object.hasOwnProperty('url')) {
          links.push({ title: object.title, url: object.url });
        }
      });
    }
    return links;
  }

  private getAuthorByKey(key: string, ): Observable<Author> {
    return this.http.get<Author>(this.apiUrl + this.authorsPath + key + this.jsonType).pipe(map((author: any) => {
      let { photos, name, bio, birth_date, death_date, links } = author;
      // Changing the API data to Interface data
      photos = this.getCoversByIdArray(photos);
      links = this.getLinksByObjectApi(links);
      return { photos, name, bio, birth_date, death_date, links };
    }));
  }

}
