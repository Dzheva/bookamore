import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import { clearAuth } from '../slices/authSlice';

// Type guard для перевірки чи це API помилка з кодом статусу
function isApiError(
  error: unknown
): error is { status: number; data?: unknown } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number'
  );
}

/**
 * Middleware для обробки 401 помилок та автоматичного логауту
 */
export const authErrorMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Перевіряємо чи це rejected action з кодом 401
    if (isRejectedWithValue(action)) {
      const error = action.payload;

      // Перевіряємо чи це API помилка з кодом 401
      if (isApiError(error) && error.status === 401) {
        // Автоматично очищуємо авторизацію при 401 помилці
        store.dispatch(clearAuth());

        // Опціонально: перенаправляємо на сторінку логіну
        if (typeof window !== 'undefined') {
          window.location.href = '/sign-in';
        }
      }
    }

    return next(action);
  };
