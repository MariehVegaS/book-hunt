import { MoreInfoUrls } from "./api.model"
import { Cover } from "./cover.model"

export interface Author {
    photos: Cover,
    name: string,
    bio: string,
    birth_date: string,
    death_date?: string,
    links?: MoreInfoUrls,
}