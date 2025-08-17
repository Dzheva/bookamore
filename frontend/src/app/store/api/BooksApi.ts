import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {ListResponse} from "@/types/entities/ListResponse";
import {convertObjectToSearchParams} from "@app/store/helpers/convertToSearchParams.ts";
import type {Book, BookPatchRequest, BookRequest} from "@/types/entities/Book";
import type {QueryParams} from "@/types/entities/QueryParams";


export const BooksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_API_URL}/books`
    }),
    endpoints: (build) => ({
        getAllBooks: build.query<ListResponse<Book>, QueryParams | void>({
            query: (params) => {
                return params ? `?${convertObjectToSearchParams(params)}` : '';
            }
        }),
        getBookById: build.query<Book, number | string>({
            query: (id) => `/${id}`
        }),
        addBook: build.mutation<Book, BookRequest>({
            query: (bookRequest) => ({
                url: '',
                method: "POST",
                body: bookRequest
            })
        }),
        updateBookById: build.mutation<Book, BookPatchRequest>({
            query: (bookPatchRequest) =>  ({
                url: `/update/${bookPatchRequest.id}`,
                method: "PATCH",
                body: bookPatchRequest.book
            })
        }),
    })
})

export const {
    useGetAllBooksQuery,
    useLazyGetAllBooksQuery,
    useLazyGetBookByIdQuery,
    useGetBookByIdQuery,
    useUpdateBookByIdMutation,
    useAddBookMutation
} = BooksApi