<template>
  <div class="atelier-shell">

    <!-- ── SIDEBAR ─────────────────────────────────────── -->
    <aside class="atelier-sidebar" :class="{ open: sidebarOpen }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <h1 class="sidebar-logo">LBK</h1>
        <p class="sidebar-tagline">Admin Atelier</p>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <div class="nav-group">
          <p class="nav-group-label">Menu Principal</p>
          <router-link
            to="/admin/stats"
            class="nav-item"
            active-class="nav-item--active"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon material-symbols-outlined">dashboard</span>
            <span>Vue d'ensemble</span>
          </router-link>
          <router-link
            to="/admin/products"
            class="nav-item"
            active-class="nav-item--active"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon material-symbols-outlined">inventory_2</span>
            <span>Produits</span>
          </router-link>
          <router-link
            to="/admin/categories"
            class="nav-item"
            active-class="nav-item--active"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon material-symbols-outlined">category</span>
            <span>Catégories</span>
          </router-link>
          <router-link
            to="/admin/notifications"
            class="nav-item"
            active-class="nav-item--active"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon material-symbols-outlined">mail</span>
            <span>Messages</span>
            <span v-if="unreadCount" class="nav-badge">{{ unreadCount }}</span>
          </router-link>
          <router-link
            to="/admin/reservations"
            class="nav-item"
            active-class="nav-item--active"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon material-symbols-outlined">calendar_month</span>
            <span>Réservations</span>
          </router-link>
        </div>

        <div class="nav-group">
          <p class="nav-group-label">Gestion</p>
          <router-link
            to="/"
            class="nav-item"
            @click="sidebarOpen = false"
          >
            <span class="nav-icon material-symbols-outlined">open_in_new</span>
            <span>Voir le site</span>
          </router-link>
        </div>
      </nav>

      <!-- Sidebar footer – admin profile -->
      <div class="sidebar-footer">
        <div class="sidebar-profile">
          <div class="profile-avatar">LB</div>
          <div>
            <p class="profile-name">Lina Boukadida</p>
            <p class="profile-role">Directrice Créative</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- ── MAIN AREA ───────────────────────────────────── -->
    <div class="atelier-main">

      <!-- Top bar -->
      <header class="atelier-topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen" aria-label="Toggle sidebar">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="topbar-search">
          <span class="material-symbols-outlined search-icon">search</span>
          <input
            class="search-input"
            type="text"
            placeholder="Rechercher un produit, une commande…"
          />
        </div>

        <div class="topbar-actions">
          <span v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</span>
          <button class="topbar-cta" @click="$router.push('/admin/notifications')">
            Action Rapide
          </button>
        </div>
      </header>

      <!-- Page content injected here -->
      <main class="atelier-content">
        <router-view @toast="showToast" @unread="setUnread" />
      </main>

      <!-- Footer -->
      <footer class="atelier-footer">
        <div>
          <p class="footer-sig">LBK &amp; Lina Boukadida</p>
          <p class="footer-copy">© 2026 L'excellence au service de votre beauté.</p>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">Mentions Légales</a>
          <a href="#" class="footer-link">Support Technique</a>
          <router-link to="/" class="footer-link">Accès Boutique</router-link>
        </div>
      </footer>
    </div>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../plugins/api';
import socket from '../plugins/socket';

const sidebarOpen = ref(false);
const unreadCount = ref(0);
const toastMsg    = ref('');
const toastType   = ref('toast-success');

// Fetch unread count on dashboard mount (before Messages page is visited)
async function fetchUnread() {
  try {
    const { data } = await api.get('/notifications');
    const messages = data.messages ?? [];
    unreadCount.value = messages.filter((m: any) => !m.read).length;
  } catch {
    // silently ignore — badge stays at 0
  }
}

// Keep badge in sync when Messages page emits its own count
function setUnread(count: number) {
  unreadCount.value = count;
}

function showToast(msg: string, type = 'toast-success') {
  toastMsg.value  = msg;
  toastType.value = type;
  setTimeout(() => { toastMsg.value = ''; }, 3500);
}

// Real-time: increment badge on new incoming message
socket.on('newMessage', () => { unreadCount.value += 1; });

onMounted(fetchUnread);
onUnmounted(() => { socket.off('newMessage'); });
</script>


<style scoped>
/* ── Shell ────────────────────────────────────────────── */

.atelier-shell {
  display: flex;
  min-height: 100vh;
  background: #f9f9f9;
  font-family: 'Manrope', sans-serif;
  overflow: hidden;
}

/* ── Sidebar ──────────────────────────────────────────── */
.atelier-sidebar {
  width: 272px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  background: #f3f3f4;
  border-right: 1px solid rgba(115, 92, 0, 0.1);
  overflow-y: auto;
  z-index: 40;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Brand block */
.sidebar-brand {
  padding: 32px 28px 28px;
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
}

.sidebar-logo {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.6rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  color: #735c00;
  margin: 0;
  line-height: 1;
}

.sidebar-tagline {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4d4635;
  opacity: 0.6;
  margin: 6px 0 0;
}

/* Nav groups */
.sidebar-nav {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
}

.nav-group-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4d4635;
  opacity: 0.55;
  margin: 0 0 12px 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  color: #4d4635;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: background 0.22s ease, color 0.22s ease;
  position: relative;
}

.nav-item:hover {
  background: #eeeeee;
  color: #735c00;
}

.nav-item--active {
  background: rgba(212, 175, 55, 0.12);
  color: #735c00;
}

.nav-item--active .nav-icon {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.nav-icon {
  flex-shrink: 0;
  width: 20px;
  text-align: center;
}

.nav-badge {
  margin-left: auto;
  background: #735c00;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  min-width: 20px;
  text-align: center;
}

/* Sidebar footer */
.sidebar-footer {
  padding: 20px 24px;
  border-top: 1px solid rgba(115, 92, 0, 0.08);
}

.sidebar-profile {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-avatar {
  width: 38px;
  height: 38px;
  background: #e2dfde;
  display: grid;
  place-items: center;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 0.8rem;
  color: #4d4635;
  font-weight: 600;
  flex-shrink: 0;
}

.profile-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a1c1c;
  margin: 0;
}

.profile-role {
  font-size: 9px;
  color: #4d4635;
  margin: 3px 0 0;
  opacity: 0.7;
}

/* ── Main Area ─────────────────────────────────────────── */
.atelier-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow-y: auto;
}

/* Top bar */
.atelier-topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 40px;
  background: rgba(249, 249, 249, 0.82);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
}

.menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid rgba(115, 92, 0, 0.18);
  color: #4d4635;
  width: 40px;
  height: 40px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.18s;
}
.menu-toggle:hover {
  background: #eeeeee;
}

.topbar-search {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 420px;
}

.search-icon {
  color: #4d4635;
  opacity: 0.55;
}

.search-input {
  border: none;
  background: transparent;
  font-family: 'Manrope', sans-serif;
  font-size: 0.875rem;
  color: #1a1c1c;
  width: 100%;
  outline: none;
}
.search-input::placeholder {
  color: rgba(77, 70, 53, 0.4);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.topbar-cta {
  background: #735c00;
  color: #fff;
  border: none;
  padding: 10px 22px;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.22s;
}
.topbar-cta:hover {
  background: #574500;
}

/* Toast */
.toast {
  display: inline-block;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 700;
  animation: toastIn 0.3s ease;
}

.toast-success {
  background: rgba(115, 92, 0, 0.1);
  border: 1px solid rgba(115, 92, 0, 0.25);
  color: #735c00;
}

.toast-error {
  background: rgba(186, 26, 26, 0.08);
  border: 1px solid rgba(186, 26, 26, 0.2);
  color: #ba1a1a;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Page content */
.atelier-content {
  flex: 1;
  padding: 40px;
}

/* Footer */
.atelier-footer {
  background: #e8e8e8;
  border-top: 1px solid rgba(115, 92, 0, 0.08);
  padding: 36px 40px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-sig {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.1rem;
  font-style: italic;
  color: #1a1c1c;
  margin: 0;
}

.footer-copy {
  font-size: 11px;
  color: #4d4635;
  margin: 4px 0 0;
  opacity: 0.7;
}

.footer-links {
  display: flex;
  gap: 32px;
}

.footer-link {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #4d4635;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.18s, color 0.18s;
}
.footer-link:hover {
  opacity: 1;
  color: #735c00;
}

/* Mobile overlay */
.sidebar-overlay {
  display: none;
}

/* ── Responsive ────────────────────────────────────────── */
@media (max-width: 960px) {
  .atelier-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-110%);
    box-shadow: 4px 0 40px rgba(26, 28, 28, 0.12);
  }
  .atelier-sidebar.open {
    transform: translateX(0);
  }
  .menu-toggle {
    display: inline-flex;
  }
  .atelier-content {
    padding: 24px 20px;
  }
  .atelier-topbar {
    padding: 0 20px;
  }
  .atelier-footer {
    padding: 28px 20px;
  }
  .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(26, 28, 28, 0.3);
    z-index: 35;
    backdrop-filter: blur(2px);
  }
}
</style>
