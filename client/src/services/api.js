const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available in storage
api.interceptors.request.use(
  (config) => {
    // Check for user or admin token depending on route
    const isAdminRoute = config.url && config.url.includes('/admin');
    const token = isAdminRoute
      ? (localStorage.getItem('adminToken') || localStorage.getItem('token'))
      : (localStorage.getItem('token') || localStorage.getItem('adminToken'));
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Capture global 401s to sign out user
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      
      // Do not hard-redirect during unit tests or active state, let components handle state transitions.
    }
    return Promise.reject(error);
  }
);

// ==========================================
// API ENDPOINTS BINDINGS
// ==========================================

export const authAPI = {
  register: (data, config = {}) => api.post('/auth/register', data, config),
  login: (data, config = {}) => api.post('/auth/login', data, config),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const incomeAPI = {
  getAll: () => api.get('/incomes'),
  create: (data) => api.post('/incomes', data),
  update: (id, data) => api.put(`/incomes/${id}`, data),
  delete: (id) => api.delete(`/incomes/${id}`),
};

export const expenseAPI = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const habitAPI = {
  getAll: () => api.get('/habits'),
  create: (data) => api.post('/habits', data),
  toggle: (id, date) => api.post(`/habits/${id}/toggle`, { date }),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
};

export const savingsAPI = {
  getAll: () => api.get('/savings'),
  create: (data) => api.post('/savings', data),
  update: (id, data) => api.put(`/savings/${id}`, data),
  addFunds: (id, amount) => api.post(`/savings/${id}/add-funds`, { amount }),
  delete: (id) => api.delete(`/savings/${id}`),
};

export const wealthAPI = {
  getDashboard: () => api.get('/wealth/dashboard'),
  
  // Investments
  getInvestments: () => api.get('/wealth/investments'),
  createInvestment: (data) => api.post('/wealth/investments', data),
  updateInvestment: (id, data) => api.put(`/wealth/investments/${id}`, data),
  deleteInvestment: (id) => api.delete(`/wealth/investments/${id}`),

  // Assets
  getAssets: () => api.get('/wealth/assets'),
  createAsset: (data) => api.post('/wealth/assets', data),
  updateAsset: (id, data) => api.put(`/wealth/assets/${id}`, data),
  deleteAsset: (id) => api.delete(`/wealth/assets/${id}`),
};

export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id) => api.get(`/admin/users/${id}/details`),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getFeedback: () => api.get('/admin/feedback'),
  resolveFeedback: (id) => api.put(`/admin/feedback/${id}/read`),
  submitFeedback: (data) => api.post('/admin/feedback', data), // User submission endpoint
  changePassword: (data) => api.put('/admin/password', data),
};

export default api;
