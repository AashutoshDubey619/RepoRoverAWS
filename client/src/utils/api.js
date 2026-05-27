import axios from 'axios';

// Use the production URL by default, or localhost for local testing if needed
const PRIMARY_URL = import.meta.env.VITE_API_URL || 'https://reporoveraws.onrender.com';

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
