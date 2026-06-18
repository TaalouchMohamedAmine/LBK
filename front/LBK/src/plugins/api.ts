import axios from 'axios';

// Relative base so Vite proxy forwards /api/* → http://localhost:3000/api/*
// In production set VITE_API_BASE to e.g. https://api.example.com
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default api;
