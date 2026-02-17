import axios from 'axios';
import { Platform } from 'react-native';

// Use localhost for web, IP address for mobile device testing
const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000/api' 
  : 'http://192.168.0.31:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for mobile
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
