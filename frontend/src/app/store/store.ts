import { configureStore } from '@reduxjs/toolkit'
import {OffersApi} from "@app/store/api/OffersApi.ts";
import {BooksApi} from "@app/store/api/BooksApi.ts";
import {AuthApi} from "@app/store/api/AuthApi.ts";
import authReducer from "@app/store/slices/authSlice.ts";
import { authErrorMiddleware } from "./middleware/authErrorMiddleware.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [OffersApi.reducerPath]: OffersApi.reducer,
        [BooksApi.reducerPath]: BooksApi.reducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        OffersApi.middleware,
        BooksApi.middleware,
        AuthApi.middleware,
        authErrorMiddleware, // Додаємо наш middleware
    ),
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store