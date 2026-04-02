import axios from 'axios'

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_BASE_URL;
  if (!url) return '/api';
  
  // 1. Remove trailing slash if present
  url = url.replace(/\/+$/, '');
  
  // 2. Ensure protocol (http/https)
  const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
  const finalUrl = isAbsolute ? url : `https://${url}`;
  
  console.log('[API] Using baseURL:', `${finalUrl}/api`);
  return `${finalUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
