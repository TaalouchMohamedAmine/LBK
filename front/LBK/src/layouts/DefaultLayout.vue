<template>
  <div class="site-shell">
    <NavBar />
    <main class="site-main"><slot /></main>
    <footer class="site-footer">
      <div class="container-max">
        <div class="footer-grid">
          <div>
            <p class="footer-brand">Lina Boukadida</p>
            <p class="footer-copy">
              Artiste maquilleuse professionnelle a Hammamet, specialisee
              mariees, fiancailles, shooting, plateaux tele et soirees.
            </p>
          </div>
          <div class="footer-col">
            <h4>Atelier</h4>
            <router-link to="/services">Services</router-link>
            <router-link to="/gallery">Galerie</router-link>
            <router-link to="/booking">Reservation</router-link>
          </div>
          <div class="footer-col">
            <h4>Social</h4>
            <a href="https://www.facebook.com/artistelinaboukadida" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/21629733307" target="_blank" rel="noreferrer">WhatsApp</a>
          </div>
          <div class="footer-col">
            <h4>Adresse</h4>
            <p>139 Av Assad Ibn El Fourat<br />Immeuble l'Escapade Royale<br />8050 Hammamet</p>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Cosmitek & Lina Boukadida.</span>
          <span>Made for excellence.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "../components/NavBar.vue";

export default defineComponent({
  name: "DefaultLayout",
  components: { NavBar },
});
</script>
