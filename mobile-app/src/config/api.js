import axios from 'axios';

// Update this with your actual backend URL
const API_BASE_URL = 'http://localhost/iluna-studio-backend/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
