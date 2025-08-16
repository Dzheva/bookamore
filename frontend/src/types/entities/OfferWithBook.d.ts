import type {Offer, OfferRequest} from "@types/entities/Offer";
import type {BookRequest} from "@types/entities/Book";

export type OfferWithBook = Omit<Offer, 'bookId'> & {book: Book}

export type OfferWithBookRequest = Omit<OfferRequest, 'bookId'> & {book: BookRequest}

