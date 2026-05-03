import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = process.env.REACT_APP_API;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  suspend: (id, suspendStatus) => api.post(`/auth/suspend/${id}`, { suspend: suspendStatus }),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getUserTengkulak: () => api.get('/users?role=tengkulak'),
  update: (id, data) => api.put(`/users/${id}`, data),
};

export const penanamanAPI = {
  getAll: (params) => api.get('/penanaman', { params }),
  getById: (id) => api.get(`/penanaman/${id}`),
  create: (data) => api.post('/penanaman', data),
  update: (id, data) => api.put(`/penanaman/${id}`, data),
  delete: (id) => api.delete(`/penanaman/${id}`),
};

export const panenAPI = {
  getAll: () => api.get('/panen'),
  create: (data) => api.post('/panen', data),
};

export const pengajuanAPI = {
  getAll: () => api.get('/pengajuan'),
  create: (data) => api.post('/pengajuan', data),
  dilihat: (id) => api.put(`/pengajuan/${id}/dilihat`),
  respon: (id, data) => api.post(`/pengajuan/${id}/respon`, data),
};

export const transaksiAPI = {
  getAll: () => api.get('/transaksi'),
};

export default api;
