import {Nullable} from "@types/utils/Nullable";

export type QueryParams = Nullable<{
    page?: string | number;
    size?: string | number;
    sortBy?: OfferSortBy
    sortDirection?: 'asc' | 'desc';
}>