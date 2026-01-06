import axios from 'axios';

// Update this with your actual backend URL
const API_BASE_URL = 'http://172.29.16.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
