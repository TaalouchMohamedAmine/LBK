const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

// Products
export const fetchProducts = () => request("/products");
export const fetchProduct = (id) => request(`/products/${id}`);
export const createProduct = (data) =>
  request("/products", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id) =>
  request(`/products/${id}`, { method: "DELETE" });

// Categories
export const fetchCategories = () => request("/categories");
export const fetchCategory = (id) => request(`/categories/${id}`);
export const createCategory = (data) =>
  request("/categories", { method: "POST", body: JSON.stringify(data) });
export const updateCategory = (id, data) =>
  request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteCategory = (id) =>
  request(`/categories/${id}`, { method: "DELETE" });

// Brands
export const fetchBrands = () => request("/brands");
export const fetchBrand = (id) => request(`/brands/${id}`);
export const createBrand = (data) =>
  request("/brands", { method: "POST", body: JSON.stringify(data) });
export const updateBrand = (id, data) =>
  request(`/brands/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteBrand = (id) =>
  request(`/brands/${id}`, { method: "DELETE" });

// Reviews
export const fetchReviews = () => request("/reviews");
export const fetchReviewsByProduct = (productId) =>
  request(`/reviews/product/${productId}`);
export const createReview = (data) =>
  request("/reviews", { method: "POST", body: JSON.stringify(data) });
export const updateReview = (id, data) =>
  request(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteReview = (id) =>
  request(`/reviews/${id}`, { method: "DELETE" });

// Beauty site sections
export const fetchServices = () => request("/services");
export const fetchGalleryItems = () => request("/gallery");
export const fetchTestimonials = () => request("/testimonials");
export const fetchFaqs = () => request("/faqs");
export const fetchBookings = () => request("/bookings");
export const createBooking = (data) =>
  request("/bookings", { method: "POST", body: JSON.stringify(data) });
export const updateBooking = (id, data) =>
  request(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteBooking = (id) =>
  request(`/bookings/${id}`, { method: "DELETE" });
export const fetchMessages = () => request("/messages");
export const createContactMessage = (data) =>
  request("/messages", { method: "POST", body: JSON.stringify(data) });
export const updateContactMessage = (id, data) =>
  request(`/messages/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteContactMessage = (id) =>
  request(`/messages/${id}`, { method: "DELETE" });
