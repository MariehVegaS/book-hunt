import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BookResults } from '../models/results.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { BookDetails, BookSearched, Work } from '../models/book.model';
import { AuthorFromBook, Doc, MoreInfoUrls } from '../models/api.model';
import { Cover } from '../models/cover.model';
import { Author } from '../models/author.model';

@Injectable({
  providedIn: "root"
})
export class BookService {

  title: string = environment.title;
  private apiUrl: string = environment.booksApi.mainUrl;
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
          let { key, seed, title, author_name, cover_i } = doc;
          let cover = this.getCoverById(cover_i).url;
          let bookKey = (seed && seed.length > 0) ? seed[0] : "";
          books.push({ workKey: key, bookKey: bookKey, title: title, cover: cover, authors: author_name });
        }
      }
      // If there is not docs, we return back a empty response
      return of({ numFound, books, query: q });
    }));
  }

  /**
   * Function in charge to get the book information by key (ex: books/OL42117571M)
   * @param bookKey 
   * @returns Observable<BookDetails>
   */
  getBookByKey(bookKey: string): Observable<BookDetails> {
    // const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    // We use switchmap to wait for the children observables
    // return this.http.get<BookDetails>(this.apiUrl + bookKey + this.jsonType, {headers}).pipe(switchMap((book: any) => {
      return this.http.get<BookDetails>(this.apiUrl + bookKey + this.jsonType).pipe(switchMap((book: any) => {
      // We get all the information and make a destructuration of each result that we need
      let { number_of_pages, works, authors, full_title } = book;
      // We check if there is a result inside docs 
      if (works && works.length > 0 && works[0].hasOwnProperty("key")) {
        // We only need the first result, because there is only a work per book
        const workObservable: Observable<Work> = this.getWorkByKey(works[0].key).pipe(
          switchMap((work) => {
            // We extract the necessary information for work
            let { title, description, subjects, covers, links, first_publish_date } = work;
            // We validate if there is information about the autors
            if (authors && authors.length > 0) {
              // We create a variable to save all the request.
              const authorObservables: Observable<Author>[] = [];
              // We search all the information for each author key
              authors.forEach((author: AuthorFromBook) => {
                if (author.hasOwnProperty("key")) {
                  const authorObservable = this.getAuthorByKey(author.key).pipe(
                    map((author) => {
                      // We extract the necessary information for author
                      let { photos, name, bio, birth_date, death_date, links } = author;
                      return { photos, name, bio, birth_date, death_date, links };
                    })
                  );
                  // We send the observable to the list
                  authorObservables.push(authorObservable);
                }
              });
              // We return the information found
              return forkJoin(authorObservables).pipe(
                map((authors: Author[]) => {
                  return { title, description, subjects, covers, links, first_publish_date, authors };
                })
              );
            }
            // If there is no information about authors, we send an empty array
            return of({ title, description, subjects, covers, links, first_publish_date, authors: [] });
          })
        );
        // We join all the information
        return forkJoin({
          work: workObservable,
          number_of_pages: of(number_of_pages),
        }).pipe(
          map(({ work, number_of_pages }) => {
            return { ...work, number_of_pages };
          })
        );
      }

      // If there is not works and authors, we return back a empty response
      return of({ title: full_title, description: "", subjects: [], covers: [], links: [], first_publish_date: "", authors: [], number_of_pages: number_of_pages });
    }));
  }

  /**
   * Function in charge of get the work information by key (ex: /works/45621SAD)
   * @param workKey 
   * @param coversQuantity 
   * @returns Observable<Work>
   */
  private getWorkByKey(workKey: string, coversQuantity?: number): Observable<Work> {
    return this.http.get<Work>(this.apiUrl + workKey + this.jsonType).pipe(map((work: any) => {
      // Info raw from api
      let { title, description, subjects, covers, links, first_publish_date, } = work;
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
      return { title, description, subjects, covers, links, first_publish_date };
    }));
  }

  /**
   * Create an array of Cover each cover id (ex: 7279887)
   * The Cover interface has the url to display the image
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

  /**
   * Function in charge of get a Cover image by Id (ex: 7279887)
   * The Cover interface has the url to display the image
   * @param id 
   * @returns Cover
   */
  private getCoverById(id: number): Cover {
    let cover: Cover = { url: "" };
    if (typeof id == 'number') {
      let postiveId = Math.abs(id);
      cover.url = this.coverUrl + postiveId + this.coverSize + this.coverType;
    }
    return cover;
  }

  /**
   * Create an array of MoreInfoUrls each object link (ex: "links": [
        {
            "url": "https://www.jkrowling.com/book/harry-potter-deathly-hallows/",
            "title": "Harry Potter and the Deathly Hallows - J.K. Rowling (jkrowling.com)",
            "type": {
                "key": "/type/link"
            }
        }, ...])
   * @param objectApi 
   * @returns MoreInfoUrls[]
   */
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

  /**
   * Function in charge of get the author information by key (ex: /authors/45621SAD)
   * @param authorKey 
   * @returns Observable<Author>
   */
  private getAuthorByKey(authorKey: string): Observable<Author> {
    return this.http.get<Author>(this.apiUrl + authorKey + this.jsonType).pipe(map((author: any) => {
      let { photos, name, bio, birth_date, death_date, links } = author;
      // Changing the API data to Interface data
      photos = this.getCoversByIdArray(photos);
      links = this.getLinksByObjectApi(links);
      return { photos, name, bio, birth_date, death_date, links };
    }));
  }

}
