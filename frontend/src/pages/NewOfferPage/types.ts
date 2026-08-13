import type { OfferType } from '@/types/entities/Offer.d.ts';
import type { BookCondition } from '@/types/entities/Book.d.ts';
import { type Category } from '@/shared/constants/categories.ts';

export interface OfferFormData {
  title: string;
  author: string;
  condition: BookCondition;
  dealType: OfferType;
  price: string;
  description: string;
  photos: File[];
  genres: string[];
}

export interface CategoryOption {
  value: Category;
  label: string;
}
