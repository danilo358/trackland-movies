// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  withCredentials: false, // usando só JWT no header
});

// Anexa o token em TODAS as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Opcional: se o token expirar, faz logout automático
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('token');
      // em apps maiores, dispararia um evento/global store para redirecionar ao /login
    }
    return Promise.reject(err);
  }
);

export default api;
