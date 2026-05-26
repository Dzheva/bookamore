import type { Offer, OfferRequest } from '@types/entities/Offer';
import type { Book, BookRequest } from '@types/entities/Book';

type Seller = {
  id: string | number;
  name: string;
  avatar?: string;
};

export type OfferWithBook = Omit<Offer, 'bookId'> & {
  book: Book;
  seller: Seller;
};

export type OfferWithBookRequest = Omit<OfferRequest, 'bookId'> & {
  book: BookRequest;
};
