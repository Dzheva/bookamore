import {createBrowserRouter} from "react-router";
import {HomePage} from "@pages/HomePage/HomePage.tsx";
import {OfferDetailsPage} from "@pages/OfferDetailsPage/OfferDetailsPage.tsx";
import {FavoritesPage} from "@pages/FavoritesPage/FavoritesPage.tsx";
import {RestorePasswordPage} from "@pages/RestorePasswordPage/RestorePasswordPage.tsx";
import {SearchResultsPage} from "@pages/SearchResultsPage/SearchResultsPage.tsx";
import {SignInPage} from "@pages/SignInPage/SignInPage.tsx";
import {SignUpPage} from "@pages/SignUpPage/SignUpPage.tsx";
import {UpdatePasswordPage} from "@pages/UpdatePasswordPage/UpdatePasswordPage.tsx";
import {AllChatsPage} from "@pages/AllChatsPage/AllChatsPage.tsx";
import {ChatPage} from "@pages/ChatPage/ChatPage.tsx";
import {GenreResultsPage} from "@pages/GenreResultsPage/GenreResultsPage.tsx";
import {NewOfferPage} from "@pages/NewOfferPage/NewOfferPage.tsx";
import {ProtectedRoute} from "@shared/components/ProtectedRoute.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element:<HomePage/>
    },
    {
        path: '/offers/:offerId',
        element: <OfferDetailsPage/>
    },
    {
        path: '/offers/new',
        element: <NewOfferPage/>
    },
    {
        path: '/favorites',
        element: <FavoritesPage/>
    },
    {
        path: '/genres/:genre',
        element: <GenreResultsPage/>
    },
    {
        path: '/forgot-password',
        element: <RestorePasswordPage/>
    },
    {
        path: '/search',
        element: <SearchResultsPage/>
    },
    {
        path: '/sign-in',
        element: <SignInPage/>
    },
    {
        path: '/sign-up',
        element: <SignUpPage/>
    },
    {
        path: '/update-password',
        element: <UpdatePasswordPage/>
    },
    {
        path: '/chats',
        element: (
            <ProtectedRoute>
                <AllChatsPage/>
            </ProtectedRoute>
        )
    },
    {
        path: '/chats/:chatId',
        element: (
            <ProtectedRoute>
                <ChatPage/>
            </ProtectedRoute>
        )
    }
])