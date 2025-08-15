import { configureStore } from '@reduxjs/toolkit'
import {OffersApi} from "@app/store/api/OffersApi.ts";
import {BooksApi} from "@app/store/api/BooksApi.ts";

export const store = configureStore({
    reducer: {
        [OffersApi.reducerPath]: OffersApi.reducer,
        [BooksApi.reducerPath]: BooksApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        OffersApi.middleware,
        BooksApi.middleware,
    ),
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store