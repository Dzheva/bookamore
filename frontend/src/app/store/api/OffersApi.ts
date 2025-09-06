import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {convertObjectToSearchParams} from "@app/store/helpers/convertToSearchParams.ts";

import type { ListResponse } from "@/types/entities/ListResponse";
import type {Offer, OfferPatchRequest, OfferRequest} from "@/types/entities/Offer";
import type {OfferWithBook, OfferWithBookRequest} from "@/types/entities/OfferWithBook";
import type {QueryParams} from "@/types/entities/QueryParams";

export const OffersApi = createApi({
    reducerPath: 'offerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_API_URL}/offers`
    }),
    endpoints: (build) => ({
        getAllOffers: build.query<ListResponse<Offer>, QueryParams | void>({
            query: (params) => {
                 return params ? `?${convertObjectToSearchParams(params)}` : '';
            }
        }),
        getOfferById: build.query<Offer,number | string>({
            query: (id) => `/${id}`
        }),
        getAllOffersWithBooks: build.query<ListResponse<OfferWithBook>, QueryParams | void>({
            query: (params) => {
                return `/with-book?${params ? convertObjectToSearchParams(params) : ''}`;
            }
        }),
        getOfferWithBookById: build.query<OfferWithBook, number | string>({
            query: (id) => `/with-book/${id}`
        }),
        addOfferWithBook: build.mutation<OfferWithBook, OfferWithBookRequest>({
            query: (newOffer) => ({
                url: '/with-book',
                method: 'POST',
                body: newOffer
            })
        }),
        addOffer: build.mutation<Offer, OfferRequest>({
            query: (newOffer) => ({
                url: '',
                method: 'POST',
                body: newOffer
            })
        }),
        updateOfferById: build.mutation<Offer, OfferPatchRequest>({
            query: (offerPatchRequest) =>  ({
                url: `/${offerPatchRequest.id}`,
                method: "PATCH",
                body: offerPatchRequest.offer
            })
        }),
        deleteOfferById: build.mutation<void, number | string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            })
        })
    })
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
    useUpdateOfferByIdMutation

} = OffersApi;
