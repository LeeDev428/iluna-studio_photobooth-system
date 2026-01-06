import axios from 'axios';

// Update this with your actual backend URL
const API_BASE_URL = 'http://192.168.8.44:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for mobile
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
