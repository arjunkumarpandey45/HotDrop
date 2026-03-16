import axios from 'axios';
const URL= import.meta.env.VITE_BACKEND_URL
const API = axios.create({
  
  baseURL: URL, 
  
 
  withCredentials: true,
  
  
  timeout: 10000, 
});

// Requests bhejne se pehle agar kuch header add karna ho (jaise logging)
API.interceptors.request.use((config) => {
  console.log(`🚀 Sending ${config.method.toUpperCase()} to ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;