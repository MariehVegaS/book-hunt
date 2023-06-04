import { Author } from "./author.model";
import { BookSearched } from "./book.model";

export interface BookResults {
    numFound: number,
    query: string,
    books: BookSearched[]
}

export interface AuthorResults {
    authors: Author[]
}