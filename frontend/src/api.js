import axios from 'axios';

const API = axios.create({
  baseURL: 'https://annapurna-backend.onrender.com/api/',
  withCredentials: true,
});

// Attach token to every request if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
