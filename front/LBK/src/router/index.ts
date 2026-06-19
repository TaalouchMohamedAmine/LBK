import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../pages/Home.vue";
import Services from "../pages/Services.vue";
import Gallery from "../pages/Gallery.vue";
import Booking from "../pages/Booking.vue";
import Contact from "../pages/Contact.vue";
import Products from "../pages/Products.vue";

// Admin pages
import AdminDashboard from "../pages/AdminDashboard.vue";
import AdminProducts from "../pages/admin/Products.vue";
import AdminCategories from "../pages/admin/Categories.vue";
import AdminNotifications from "../pages/admin/Notifications.vue";
import AdminStats from "../pages/admin/Stats.vue";
import AdminReservations from "../pages/admin/Reservations.vue";
import AdminGallery from "../pages/admin/Gallery.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "Home", component: Home },
  { path: "/services", name: "Services", component: Services },
  { path: "/gallery", name: "Gallery", component: Gallery },
  { path: "/products", name: "Products", component: Products },
  { path: "/booking", name: "Booking", component: Booking },
  { path: "/contact", name: "Contact", component: Contact },
  // Admin base route
  {
    path: "/admin",
    component: AdminDashboard,
    redirect: "/admin/stats",
    children: [
      { path: "products", component: AdminProducts },
      { path: "categories", component: AdminCategories },
      { path: "notifications", component: AdminNotifications },
      { path: "stats", component: AdminStats },
      { path: "reservations", component: AdminReservations },
      { path: "gallery", component: AdminGallery },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0, left: 0, behavior: "instant" };
  },
});

// On every navigation scroll BOTH window and any inner scrollable container to top
router.afterEach(() => {
  // Window scroll (public pages)
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // Admin inner scroll container (.atelier-main has overflow-y: auto)
  const adminMain = document.querySelector(".atelier-main");
  if (adminMain) adminMain.scrollTop = 0;

  // Also reset the admin content area
  const atelierContent = document.querySelector(".atelier-content");
  if (atelierContent) atelierContent.scrollTop = 0;
});

export default router;
