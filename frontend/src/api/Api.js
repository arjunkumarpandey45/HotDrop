import axios from 'axios';

const API = axios.create({
  
  baseURL: "http://localhost:8080", 
  
 
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