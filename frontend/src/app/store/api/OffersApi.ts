import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { convertObjectToSearchParams } from '@app/store/helpers/convertToSearchParams.ts';

import type { ListResponse } from '@/types/entities/ListResponse';
import type {
  Offer,
  OfferPatchRequest,
  OfferRequest,
} from '@/types/entities/Offer';
import type {
  OfferWithBook,
  OfferWithBookRequest,
} from '@/types/entities/OfferWithBook';
import type { QueryParams } from '@/types/entities/QueryParams';
import type { RootState } from '../store';

export const OffersApi = createApi({
  reducerPath: 'offerApi',
  tagTypes: ['Offer'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/offers`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    getAllOffers: build.query<ListResponse<Offer>, QueryParams | void>({
      query: (params) => {
        return params ? `?${convertObjectToSearchParams(params)}` : '';
      },
      providesTags: () => [{ type: 'Offer', id: 'LIST' }],
    }),
    getOfferById: build.query<Offer, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Offer', id }],
    }),
    getAllOffersWithBooks: build.query<
      ListResponse<OfferWithBook>,
      QueryParams | void
    >({
      query: (params) => {
        return `/with-book?${params ? convertObjectToSearchParams(params) : ''}`;
      },
      providesTags: () => [{ type: 'Offer', id: 'LIST' }],
    }),
    getOfferWithBookById: build.query<OfferWithBook, string>({
      query: (id) => `/with-book/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Offer', id }],
    }),
    addOfferWithBook: build.mutation<OfferWithBook, OfferWithBookRequest>({
      query: (newOffer) => ({
        url: '/with-book',
        method: 'POST',
        body: newOffer,
      }),
    }),
    addOffer: build.mutation<Offer, OfferRequest>({
      query: (newOffer) => ({
        url: '',
        method: 'POST',
        body: newOffer,
      }),
    }),
    updateOfferById: build.mutation<Offer, OfferPatchRequest>({
      query: (offerPatchRequest) => ({
        url: `/${offerPatchRequest.id}`,
        method: 'PATCH',
        body: offerPatchRequest.offer,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Offer', id },
        { type: 'Offer', id: 'LIST' },
      ],
    }),
    deleteOfferById: build.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetAllOffersQuery,
  useLazyGetAllOffersQuery,
  useGetOfferByIdQuery,
  useLazyGetOfferByIdQuery,
  useGetOfferWithBookByIdQuery,
  useLazyGetOfferWithBookByIdQuery,
  useAddOfferMutation,
  useAddOfferWithBookMutation,
  useDeleteOfferByIdMutation,
  useGetAllOffersWithBooksQuery,
  useLazyGetAllOffersWithBooksQuery,
  useUpdateOfferByIdMutation,
} = OffersApi;
