import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Book, BookPatchRequest } from '@/types/entities/Book';
import type { RootState } from '../store';

export const BooksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_API_URL}/books`,
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
    getBookById: build.query<Book, number | string>({
      query: (id) => `/${id}`,
    }),
    updateBookById: build.mutation<Book, BookPatchRequest>({
      query: (bookPatchRequest) => ({
        url: `/${bookPatchRequest.id}`,
        method: 'PATCH',
        body: bookPatchRequest.book,
      }),
    }),
  }),
});

export const {
  useLazyGetBookByIdQuery,
  useGetBookByIdQuery,
  useUpdateBookByIdMutation,
} = BooksApi;
