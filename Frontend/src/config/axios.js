import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
if (baseURL != import.meta.env.VITE_API_URL) {
  console.error("VITE_API_URL is not defined");
}


export default api;