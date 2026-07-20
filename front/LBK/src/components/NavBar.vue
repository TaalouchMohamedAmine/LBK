<template>
  <nav class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand" aria-label="Lina Boukadida home">
        <img src="/logo-lbk-nobg.png" alt="Lina Boukadida Logo" class="brand-logo" />
      </router-link>

      <ul class="nav-links" :class="{ 'is-open': isOpen }">
        <li><router-link to="/" @click="isOpen = false">Accueil</router-link></li>
        <li><router-link to="/services" @click="isOpen = false">Services</router-link></li>
        <li><router-link to="/gallery" @click="isOpen = false">Galerie</router-link></li>
        <li><router-link to="/products" @click="isOpen = false">Boutique</router-link></li>
        <li><router-link to="/contact" @click="isOpen = false">Contact</router-link></li>
        <li>
          <a href="https://www.facebook.com/artistelinaboukadida" target="_blank" rel="noreferrer" @click="isOpen = false">
            Facebook
          </a>
        </li>
      </ul>

      <router-link to="/booking" class="nav-cta">Reserver</router-link>

      <div class="mobile-menu">
        <button type="button" class="burger-button" @click="isOpen = !isOpen" aria-label="Toggle menu">
          <span class="burger-line" :class="{ 'is-active': isOpen }"></span>
          <span class="burger-line" :class="{ 'is-active': isOpen }"></span>
          <span class="burger-line" :class="{ 'is-active': isOpen }"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "NavBar",
  setup() {
    const isOpen = ref(false);
    return { isOpen };
  }
});
</script>
