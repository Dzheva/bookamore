import { createBrowserRouter } from 'react-router';
import { HomePage } from '@pages/HomePage/HomePage.tsx';
import { OfferDetailsPage } from '@pages/OfferDetailsPage/OfferDetailsPage.tsx';
import { FavoritesPage } from '@pages/FavoritesPage/FavoritesPage.tsx';
import { SearchResultsPage } from '@pages/SearchResultsPage/SearchResultsPage.tsx';
import { SignInPage } from '@pages/SignInPage/SignInPage.tsx';
import { SignUpPage } from '@pages/SignUpPage/SignUpPage.tsx';
import { RestorePasswordPage } from '@pages/RestorePasswordPage/RestorePasswordPage.tsx';
import { VerificationCodePage } from '@/pages/VerificationCodePage/VerificationCodePage';
import { UpdatePasswordPage } from '@pages/UpdatePasswordPage/UpdatePasswordPage.tsx';
import { AllChatsPage } from '@pages/AllChatsPage/AllChatsPage.tsx';
import { ChatPage } from '@pages/ChatPage/ChatPage.tsx';
import { GenreResultsPage } from '@pages/GenreResultsPage/GenreResultsPage.tsx';
import { NewOfferPage } from '@pages/NewOfferPage/NewOfferPage.tsx';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import MyAnnouncementsPage from '@/pages/MyAnnouncementsPage/MyAnnouncementsPage';
import OrdersPage from '@/pages/OrdersPage/OrdersPage';
import SettingsPage from '@/pages/SettingsPage/SettingsPage';
import { ProtectedRoute } from '@shared/components/ProtectedRoute.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/offers/:offerId/edit',
    element: (
      <ProtectedRoute>
        <NewOfferPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/offers/:offerId',
    element: <OfferDetailsPage />,
  },
  {
    path: '/offers/new',
    element: (
      <ProtectedRoute>
        <NewOfferPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/favorites',
    element: <FavoritesPage />,
  },
  {
    path: '/genres/:genre',
    element: <GenreResultsPage />,
  },
  {
    path: '/forgot-password',
    element: <RestorePasswordPage />,
  },
  {
    path: '/verification-code',
    element: <VerificationCodePage />,
  },
  {
    path: '/update-password',
    element: <UpdatePasswordPage />,
  },
  {
    path: '/search',
    element: <SearchResultsPage />,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/chats',
    element: (
      <ProtectedRoute>
        <AllChatsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chats/:chatId',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/my-announcements',
    element: (
      <ProtectedRoute>
        <MyAnnouncementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
]);
