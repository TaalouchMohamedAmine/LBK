/**
 * Public-facing API helpers — thin wrappers around the shared Axios instance.
 * All paths are relative to the /api base set in plugins/api.ts.
 */
import api from '../plugins/api';

export async function fetchServices() {
  try {
    const res = await api.get('/services');
    return res.data || [];
  } catch {
    return [];
  }
}

export async function fetchGallery() {
  try {
    const res = await api.get('/gallery');
    return res.data || [];
  } catch {
    return [];
  }
}

export async function fetchProducts() {
  try {
    const res = await api.get('/products');
    return res.data || [];
  } catch {
    return [];
  }
}

export async function createBooking(payload: Record<string, unknown>) {
  return api.post('/bookings', payload);
}

export async function createMessage(payload: Record<string, unknown>) {
  return api.post('/messages', payload);
}

export default { fetchServices, fetchGallery, fetchProducts, createBooking, createMessage };
