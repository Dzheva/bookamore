import { Nullable } from '@types/utils/Nullable';
import type { OfferSortBy } from '@types/entities/Offer';
import type { Category } from '@/shared/constants/categories';

export type QueryParams = Nullable<{
  page?: string | number;
  size?: string | number;
  sortBy?: OfferSortBy;
  sortDir?: 'asc' | 'desc';
  genres?: Category | Category[] | string | string[];
  condition?: string;
  search?: string;
  sellerId?: string | number;
}>;
