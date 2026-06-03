<template>
  <nav class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand" aria-label="Lina Boukadida home">
        <span class="brand-name">Lina Boukadida</span>
        <span class="brand-subtitle">Makeup Artist</span>
      </router-link>

      <ul class="nav-links">
        <li><router-link to="/">Accueil</router-link></li>
        <li><router-link to="/services">Services</router-link></li>
        <li><router-link to="/gallery">Galerie</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
        <li>
          <a href="https://www.facebook.com/artistelinaboukadida" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </li>
      </ul>

      <router-link to="/booking" class="nav-cta">Reserver</router-link>

      <div class="mobile-menu">
        <router-link to="/booking" aria-label="Reserver">
          <button type="button">+</button>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NavBar",
});
</script>
