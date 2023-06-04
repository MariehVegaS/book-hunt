import { MoreInfoUrls } from "./api.model"
import { Author } from "./author.model"
import { Cover } from "./cover.model"

export interface Book{
    title: string,
    description: string,
    covers?: Cover[],
    links?: MoreInfoUrls[],
    first_publish_date: string,
    authors?: Author[],
    number_of_pages_median: number
}

export interface Work{
    covers?: Cover[],
    links?: MoreInfoUrls[],
    description: string,
    first_publish_date: string,
}