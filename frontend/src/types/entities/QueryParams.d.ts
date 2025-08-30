import {Nullable} from "@types/utils/Nullable";
import type {OfferSortBy} from "@types/entities/Offer";

export type QueryParams = Nullable<{
    page?: string | number;
    size?: string | number;
    sortBy?: OfferSortBy
    sortDirection?: 'asc' | 'desc';
    genre?: string;       
  condition?: string;    
  search?: string; 
}>