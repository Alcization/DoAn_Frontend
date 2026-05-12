import axios from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const buildApiUrl = (path: string) => {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
