import type { AxiosResponse } from "axios";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function fetchServices() {
  try {
    const res = await axios.get(`${API_BASE}/services`);
    return res.data || [];
  } catch (e) {
    return [];
  }
}

export async function fetchGallery() {
  try {
    const res = await axios.get(`${API_BASE}/gallery`);
    return res.data || [];
  } catch {
    return [];
  }
}

export async function createBooking(payload: any) {
  return axios.post(`${API_BASE}/bookings`, payload);
}

export async function createMessage(payload: any) {
  return axios.post(`${API_BASE}/messages`, payload);
}

export default { fetchServices, fetchGallery, createBooking, createMessage };
