<template>
  <DefaultLayout>
    <header class="page-hero">
      <div class="container-max">
        <span class="section-kicker">Contact</span>
        <h1 class="section-title">Parlons de votre <em>moment.</em></h1>
        <p class="section-copy hero-copy">
          Une question, une collaboration, une demande particuliere? L'atelier
          vous repond avec attention.
        </p>
      </div>
    </header>

    <section class="page-section">
      <div class="container-max contact-grid">
        <div class="info-stack">
          <div class="info-row">
            <span class="info-icon">01</span>
            <div>
              <h3>Atelier</h3>
              <p>139 Av Assad Ibn El Fourat<br />Immeuble l'Escapade Royale<br />8050 Hammamet</p>
            </div>
          </div>
          <div class="info-row">
            <span class="info-icon">02</span>
            <div>
              <h3>Disponibilite</h3>
              <p>Ouvert tous les jours: 09:00 - 20:00<br />Telephone: +216 29 733 307</p>
            </div>
          </div>
          <div>
            <span class="section-kicker">Reseaux sociaux</span>
            <div class="social-row">
              <a class="social-link" href="https://www.facebook.com/artistelinaboukadida" target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a class="social-link" href="https://wa.me/21629733307" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a class="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
          <div class="map-panel">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1000&q=85"
              alt="Coastal map inspired texture"
              @error="useFallbackImage"
            />
            <div class="map-badge">
              <span class="product-label">Atelier</span>
              <h3>Hammamet</h3>
            </div>
          </div>
        </div>

        <form class="atelier-form" @submit.prevent="submit">
          <h2>Ecrire a l'atelier</h2>
          <p>
            Envoyez votre message et nous reviendrons vers vous pour organiser
            la meilleure experience.
          </p>
          <div class="form-grid">
            <label class="field">
              <span class="form-label">Nom</span>
              <input v-model="form.name" required placeholder="Votre nom" />
            </label>
            <label class="field">
              <span class="form-label">Email</span>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="votre@email.com"
              />
            </label>
            <label class="field">
              <span class="form-label">Message</span>
              <textarea
                v-model="form.message"
                required
                rows="6"
                placeholder="Comment pouvons-nous vous aider?"
              ></textarea>
            </label>
            <UiButton class="form-submit" type="submit">Envoyer le message</UiButton>
          </div>
        </form>
      </div>
    </section>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UiButton from "@/components/ui/Button.vue";
import { createMessage } from "@/services/api";

const fallbackPhoto =
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=85";

export default defineComponent({
  name: "ContactPage",
  components: { DefaultLayout, UiButton },
  setup() {
    const form = ref({ name: "", email: "", message: "" });

    async function submit() {
      await createMessage(form.value);
      alert("Votre message a ete envoye.");
    }

    function useFallbackImage(event: Event) {
      const image = event.target as HTMLImageElement;
      if (image.src !== fallbackPhoto) {
        image.src = fallbackPhoto;
      }
    }

    return { form, submit, useFallbackImage };
  },
});
</script>
