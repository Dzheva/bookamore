export type Book = {
        "id": number,
        "title": string,
        "yearOfRelease": number,
        "description": string,
        "isbn": string,
        "condition": BookCondition,
        "authors": string[],
        "genres": string[],
        "images": string[]
}


export enum BookCondition  {
    NEW = 'NEW',
    AS_NEW = 'AS_NEW',
    USED = 'USED',
}

export type BookRequest = Omit<Book, "id" | 'images'> & {images: File[]}

export type BookPatchRequest = {
    id: number | string
    book: Partial<BookRequest>
}