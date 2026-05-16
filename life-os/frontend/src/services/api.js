import axios from 'axios';
const BASE_URL = 'https://life-os-production-8bc2.up.railway.app';
const api = axios.create({

  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================

api.interceptors.request.use((config) => {

  const token =
    localStorage.getItem('accessToken');

  // Don't attach token on auth routes
  if (
    token &&
    !config.url.includes('/api/auth/login') &&
    !config.url.includes('/api/auth/register') &&
    !config.url.includes('/api/auth/refresh')
  ) {

    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

// ==============================
// RESPONSE INTERCEPTOR
// ==============================

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    // Skip refresh logic for auth routes
    if (
      originalRequest?.url?.includes('/api/auth/login') ||
      originalRequest?.url?.includes('/api/auth/register') ||
      originalRequest?.url?.includes('/api/auth/refresh')
    ) {

      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      try {

        const refreshToken =
          localStorage.getItem('refreshToken');

        // No refresh token
        if (!refreshToken) {

          return Promise.reject(error);
        }

        const { data } = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem(
          'accessToken',
          data.accessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);

      } catch (err) {

        console.error(
          'Refresh token failed'
        );

        localStorage.removeItem(
          'accessToken'
        );

        localStorage.removeItem(
          'refreshToken'
        );

        localStorage.removeItem(
          'auth-storage'
        );

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ==============================
// AUTH APIs
// ==============================

export const authApi = {

  register: (data) =>
    api.post('/api/auth/register', data),

  login: (data) =>
    api.post('/api/auth/login', data),

  refresh: (data) =>
    api.post('/api/auth/refresh', data),
};

// ==============================
// HABIT APIs
// ==============================

export const habitApi = {

  getAll: () =>
    api.get('/api/habits'),

  getOne: (id) =>
    api.get(`/api/habits/${id}`),

  create: (data) =>
    api.post('/api/habits', data),

  update: (id, data) =>
    api.put(`/api/habits/${id}`, data),

  delete: (id) =>
    api.delete(`/api/habits/${id}`),

  archive: (id) =>
    api.patch(`/api/habits/${id}/archive`),

  log: (id, data) =>
    api.post(`/api/habits/${id}/log`, data),

  getLogs: (id, start, end) =>
    api.get(`/api/habits/${id}/logs`, {
      params: { start, end }
    }),

  getStats: () =>
    api.get('/api/habits/stats'),
};

// ==============================
// EXPENSE APIs
// ==============================

export const expenseApi = {

  getAll: () =>
    api.get('/api/expenses'),

  getByRange: (start, end) =>
    api.get('/api/expenses/range', {
      params: { start, end }
    }),

  create: (data) =>
    api.post('/api/expenses', data),

  update: (id, data) =>
    api.put(`/api/expenses/${id}`, data),

  delete: (id) =>
    api.delete(`/api/expenses/${id}`),

  getStats: () =>
    api.get('/api/expenses/stats'),

  createBudget: (data) =>
    api.post('/api/expenses/budgets', data),

  getBudgets: (month, year) =>
    api.get(`/api/expenses/budgets`, {
      params: { month, year }
    }),

  deleteBudget: (id) =>
    api.delete(`/api/expenses/budgets/${id}`),
};

// ==============================
// TODO APIs
// ==============================

export const todoApi = {

  getAll: () =>
    api.get('/api/todos'),

  getByStatus: (status) =>
    api.get(`/api/todos/status/${status}`),

  create: (data) =>
    api.post('/api/todos', data),

  update: (id, data) =>
    api.put(`/api/todos/${id}`, data),

  toggle: (id) =>
    api.patch(`/api/todos/${id}/toggle`),

  delete: (id) =>
    api.delete(`/api/todos/${id}`),

  getStats: () =>
    api.get('/api/todos/stats'),

  createProject: (data) =>
    api.post('/api/todos/projects', data),

  getProjects: () =>
    api.get('/api/todos/projects'),

  deleteProject: (id) =>
    api.delete(`/api/todos/projects/${id}`),
};

export default api;