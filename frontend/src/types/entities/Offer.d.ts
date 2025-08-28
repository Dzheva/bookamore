//import type { Nullable } from "@types/utils/Nullable";

export type Offer = {
    "id": number,
    "type": OfferType,
    "status": OfferStatus,
    "description": string,
    "price": number,
    "previewImage": string,
    "bookId": number,
    "sellerId": number
}

export type OfferRequest = Omit<Offer, 'id' | 'previewImage'> & {previewImage: File}

export type OfferPatchRequest = {
    id: number | string;
    offer: Partial<OfferRequest>
}

export enum OfferType {
    SELL = 'SELL',
    EXCHANGE = 'EXCHANGE',
    SELL_EXCHANGE = 'SELL_EXCHANGE'
}

export enum OfferStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    HIDDEN = 'HIDDEN',
}



export type OfferSortBy =  "id" |
    "createdDate" |
    "lastModifiedDate" |
    'price' |
    'type' |
    'status' |
    'title' |
    "yearOfRelease" |
    "description" |
    "condition" |
    "authorName"
