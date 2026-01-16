import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Функції для роботи з localStorage
const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const setStoredAuth = (token: string, user: User): void => {
  try {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth to localStorage:', error);
  }
};

const clearStoredAuth = (): void => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  } catch (error) {
    console.error('Failed to clear auth from localStorage:', error);
  }
};

// Ініціальний стан - завжди намагаємось відновити з localStorage
const storedToken = getStoredToken();
const storedUser = getStoredUser();

const initialState: AuthState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!(storedToken && storedUser),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Встановлення креденшелів після успішного логіну
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Синхронізуємо з localStorage
      setStoredAuth(token, user);
    },

    // Очищення при логауті
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Очищуємо localStorage
      clearStoredAuth();
    },

    // Встановлення стану завантаження
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Оновлення інформації користувача
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        // Оновлюємо localStorage
        if (state.token) {
          setStoredAuth(state.token, state.user);
        }
      }
    },

    // Очищення стану при помилці токену (401, тощо)
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      clearStoredAuth();
    },
  },
});

export const { setCredentials, logout, setLoading, updateUser, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;

// Селектори для зручного використання
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
