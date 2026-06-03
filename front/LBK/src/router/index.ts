import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Services from "../pages/Services.vue";
import Gallery from "../pages/Gallery.vue";
import Booking from "../pages/Booking.vue";
import Contact from "../pages/Contact.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/services", name: "Services", component: Services },
  { path: "/gallery", name: "Gallery", component: Gallery },
  { path: "/booking", name: "Booking", component: Booking },
  { path: "/contact", name: "Contact", component: Contact },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
