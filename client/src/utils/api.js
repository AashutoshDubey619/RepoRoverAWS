import axios from 'axios';

// Exclusively use localhost for local development
const PRIMARY_URL = 'http://localhost:5000';

// Create axios instance without a strict timeout, since ingestion can take several minutes
const api = axios.create({
  baseURL: PRIMARY_URL,
});

// Automatically attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Export the active URL for Socket.io
export const getSocketURL = () => PRIMARY_URL;

export default api;
