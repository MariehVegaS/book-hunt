export interface GeneralSearchResults {
    numFound: number,
    docs?: Doc[]
}

export interface Doc{
    key: string,
    cover_i: number;
    title: string,
    number_of_pages_median: number,
    author_key: string[],
    author_name?: string[]
}

export interface MoreInfoUrls {
    title: string,
    url: string
}