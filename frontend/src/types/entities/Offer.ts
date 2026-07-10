export type Offer = {
  id: string;
  type: OfferType;
  status: OfferStatus;
  description: string;
  price: number;
  previewImage: string;
  bookId: string;
  sellerId: string;
};

export type OfferRequest = Omit<Offer, 'id' | 'previewImage'> & {
  previewImage: File | null;
};

export type OfferPatchRequest = {
  id: string;
  offer: Partial<OfferRequest>;
};

export const OfferType = {
  SELL: 'SELL',
  EXCHANGE: 'EXCHANGE',
  SELL_EXCHANGE: 'SELL_EXCHANGE',
} as const;

export type OfferType = (typeof OfferType)[keyof typeof OfferType];

export const OfferStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  HIDDEN: 'HIDDEN',
} as const;

export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];

export type OfferSortBy =
  | 'id'
  | 'createdDate'
  | 'lastModifiedDate'
  | 'price'
  | 'type'
  | 'status'
  | 'title'
  | 'yearOfRelease'
  | 'description'
  | 'condition'
  | 'authorName';
