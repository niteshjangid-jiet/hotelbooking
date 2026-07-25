import axios from 'axios';

// Base Axios Instance - Structure ready for future API & Supabase endpoints
const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.hotelbookingsite.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiService.interceptors.request.use(
  (config) => {
    // Ready for Auth Token attachment in future modules
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiService.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Service Error:', error);
    return Promise.reject(error);
  }
);

export default apiService;
