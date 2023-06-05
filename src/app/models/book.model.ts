import { MoreInfoUrls } from "./api.model"
import { Author } from "./author.model"
import { Cover } from "./cover.model"

export interface BookDetails{
    title: string,
    description: string,
    covers?: Cover[],
    links?: MoreInfoUrls[],
    first_publish_date: string,
    authors?: Author[],
    subjects: string,
    number_of_pages_median: number
}

export interface BookSearched{
    workKey: string, // Work key
    title: string,
    cover: string,
    authors?: string[],
}

export interface Work{
    title: string,
    description: string,
    subjects: string,
    covers?: Cover[],
    links?: MoreInfoUrls[],
    first_publish_date: string,
    authors?: Author[],
}