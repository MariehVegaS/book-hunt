export interface Doc{
    key?: string, 
    seed: string[],
    cover_i: number,
    title: string,
    number_of_pages_median: number,
    author_key: string[],
    author_name?: string[]
}

export interface MoreInfoUrls {
    title: string,
    url: string
}

export interface Book{
    pagination: number
    works: WorkFromBook[],
    authors: AuthorFromBook[]
}

export interface WorkFromBook {
    key: string
}

export interface AuthorFromBook {
    key: string
}