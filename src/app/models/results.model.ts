import { Doc } from "./api.model";
import { Author } from "./author.model";

export interface BookResults {
    numFound: number,
    docs?: Doc[]
}

export interface AuthorResults {
    books: Author[]
}