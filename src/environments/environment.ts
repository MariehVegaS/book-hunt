export const environment = {
    production: true,
    title: "Production Environment Heading",
    booksApi: {
        mainUrl: "https://openlibrary.org/",
        coverUrl : "https://covers.openlibrary.org/b/id/",
        booksApi: "books/",
        authorsApi: "authors/",
        generalSearch: "search.json?",
        authorSearch: "authors.json?",
        generalSearchKeyParam: "q=",
        titleSearchKeyParam: "title=",
        authorSearchKeyParam: "author=",
        availableSearchParam: "fields=*,availability",
        limitSearchParam: "limit=",
        jsonType: ".json",
        coverType: ".jpg",
        coverSize: "-M"
    }
};
