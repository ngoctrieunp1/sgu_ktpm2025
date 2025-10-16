// src/axios.js
import axios from 'axios';
import { getToken } from './Pages/Signup/LocalStorage/LocalDb';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = getToken() || null;
  if (!config.headers) config.headers = {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
