import axios from 'axios';

const base = import.meta.env.VITE_API_URL || 'http://localhost:4000';
console.log('API baseURL =', base);

const api = axios.create({
  baseURL: base
});


export default api;