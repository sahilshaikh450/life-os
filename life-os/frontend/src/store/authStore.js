import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../services/api';

export const useAuthStore = create(
  persist(

    (set) => ({

      user: null,

      accessToken: null,

      refreshToken: null,

      isAuthenticated: false,

      // =========================
      // LOGIN
      // =========================

      login: async (credentials) => {

        const { data } =
          await authApi.login(credentials);

        localStorage.setItem(
          'accessToken',
          data.accessToken
        );

        localStorage.setItem(
          'refreshToken',
          data.refreshToken
        );

        set({

          user: data.user,

          accessToken: data.accessToken,

          refreshToken: data.refreshToken,

          isAuthenticated: true,
        });

        return data;
      },

      // =========================
      // REGISTER
      // =========================

      register: async (userData) => {

        const { data } =
          await authApi.register(userData);

        localStorage.setItem(
          'accessToken',
          data.accessToken
        );

        localStorage.setItem(
          'refreshToken',
          data.refreshToken
        );

        set({

          user: data.user,

          accessToken: data.accessToken,

          refreshToken: data.refreshToken,

          isAuthenticated: true,
        });

        return data;
      },

      // =========================
      // LOGOUT
      // =========================

      logout: () => {

        localStorage.removeItem('accessToken');

        localStorage.removeItem('refreshToken');

        localStorage.removeItem('auth-storage');

        set({

          user: null,

          accessToken: null,

          refreshToken: null,

          isAuthenticated: false,
        });
      },

      // =========================
      // UPDATE USER
      // =========================

      updateUser: (user) => set({ user }),
    }),

    // =========================
    // PERSIST CONFIG
    // =========================

    {

      name: 'auth-storage',

      partialize: (state) => ({

        user: state.user,

        accessToken: state.accessToken,

        refreshToken: state.refreshToken,

        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);