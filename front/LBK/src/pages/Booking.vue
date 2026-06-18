<template>
  <DefaultLayout>
    <header class="page-hero">
      <div class="container-max page-hero-grid">
        <div>
          <span class="section-kicker">Prendre rendez-vous</span>
          <h1 class="section-title">L'art de la <em>sublimation.</em></h1>
          <p class="section-copy hero-copy">
            Entrez dans l'univers de Lina Boukadida. L'atelier vous accueille
            pour une experience beaute sur mesure a Hammamet.
          </p>
        </div>
        <div class="page-hero-image">
          <img
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=85"
            alt="Luxury beauty atelier portrait"
            @error="useFallbackImage"
          />
          <div class="quote-note">La beaute commence quand vous osez etre vous.</div>
        </div>
      </div>
    </header>

    <section class="page-section">
      <div class="container-max contact-grid">
        <div class="info-stack">
          <div>
            <span class="section-kicker">Atelier LBK</span>
            <h2 class="section-title">Nous <em>trouver.</em></h2>
          </div>
          <div class="info-row">
            <span class="info-icon">01</span>
            <div>
              <h3>Adresse</h3>
            <p>Avenue Assed Ibn El Fourat<br />Rue Sidi Bou Ali, Hammamet</p>
            </div>
          </div>
          <div class="info-row">
            <span class="info-icon">02</span>
            <div>
              <h3>Horaires</h3>
              <p>Ouvert tous les jours: 09:00 - 20:00<br />Telephone: +216 29 733 307</p>
            </div>
          </div>
          <div class="map-panel">
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1000&q=85"
              alt="Minimal coastal map texture"
              @error="useFallbackImage"
            />
            <div class="map-badge">
              <span class="product-label">Localisation</span>
              <h3>Hammamet, Tunisie</h3>
            </div>
          </div>
        </div>

        <form class="atelier-form" @submit.prevent="submit">
          <h2>Reservation</h2>
          <p>
            Remplissez le formulaire, nous vous contactons pour confirmer votre
            seance et preparer les details.
          </p>
          <div class="form-grid">
            <label class="field">
              <span class="form-label">Nom complet</span>
              <input v-model="form.name" required placeholder="Votre nom et prenom" />
            </label>
            <div class="form-row">
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
                <span class="form-label">Telephone</span>
                <input v-model="form.phone" type="tel" placeholder="+216 ..." />
              </label>
            </div>
            <div class="form-row">
              <label class="field">
                <span class="form-label">Service</span>
                <select v-model="form.serviceId" required>
                  <option value="" disabled>Choisir un service</option>
                  <option v-for="service in visibleServices" :key="service.id" :value="service.id">
                    {{ service.title }}
                  </option>
                </select>
              </label>
              <label class="field">
                <span class="form-label">Date souhaitee</span>
                <input v-model="form.date" type="date" />
              </label>
            </div>
            <label class="field">
              <span class="form-label">Message</span>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="Precisez vos besoins particuliers..."
              ></textarea>
            </label>
            <UiButton class="form-submit" type="submit" :disabled="loading">
              {{ loading ? "Envoi en cours..." : "Envoyer la demande" }}
            </UiButton>

            <!-- Success feedback -->
            <div v-if="submitStatus === 'success'" class="form-feedback form-feedback--success">
              ✓ Votre demande a bien ete envoyee ! Nous vous contacterons tres prochainement.
            </div>

            <!-- Error feedback -->
            <div v-if="submitStatus === 'error'" class="form-feedback form-feedback--error">
              ✗ {{ errorMessage }}
            </div>

          </div>
        </form>
      </div>
    </section>

    <section class="container-max page-section">
      <div class="visual-strip">
        <img
          src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=85"
          alt="Lina Boukadida wtiya makeup"
          @error="useFallbackImage"
        />
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85"
          alt="Lina Boukadida bridal makeup"
          @error="useFallbackImage"
        />
        <img
          src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85"
          alt="Lina Boukadida engagement makeup"
          @error="useFallbackImage"
        />
      </div>
    </section>
  </DefaultLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UiButton from "@/components/ui/Button.vue";
import { createBooking, fetchServices } from "@/services/api";

const fallbackPhoto =
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=85";

type Service = {
  id: string | number;
  title: string;
  description?: string;
  priceFrom?: string | number;
};

const fallbackServices: Service[] = [
  { id: "bridal", title: "Mariage Prestige" },
  { id: "event", title: "Fiancailles & Soiree" },
  { id: "editorial", title: "Shooting, Defile & TV" },
  { id: "beauty", title: "Soins & Beaute Finale" },
];

export default defineComponent({
  name: "BookingPage",
  components: { DefaultLayout, UiButton },
  setup() {
    const route = useRoute();
    const services = ref<Service[]>([]);
    const loading = ref(false);
    const submitStatus = ref<"idle" | "success" | "error">("idle");
    const errorMessage = ref("");

    const form = ref({
      name: "",
      email: "",
      phone: "",
      serviceId: String(route.query.service || ""),
      date: "",
      message: "",
    });

    const visibleServices = computed(() =>
      services.value.length ? services.value : fallbackServices,
    );

    onMounted(async () => {
      const remote = await fetchServices();
      services.value = Array.isArray(remote) && remote.length ? remote : fallbackServices;
      if (!form.value.serviceId && visibleServices.value[0]) {
        form.value.serviceId = String(visibleServices.value[0].id);
      }
    });

    async function submit() {
      loading.value = true;
      submitStatus.value = "idle";
      errorMessage.value = "";

      // Resolve the human-readable service name from the selected serviceId
      const selectedService = visibleServices.value.find(
        (s) => String(s.id) === String(form.value.serviceId),
      );
      const serviceName = selectedService?.title || form.value.serviceId;

      // Map form fields to the backend BookingRequest schema
      const payload = {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone || undefined,
        service: serviceName,
        preferredDate: form.value.date ? new Date(form.value.date).toISOString() : null,
        notes: form.value.message || undefined,
      };

      try {
        await createBooking(payload);
        submitStatus.value = "success";
        // Reset form after successful submission
        form.value = {
          name: "",
          email: "",
          phone: "",
          serviceId: visibleServices.value[0] ? String(visibleServices.value[0].id) : "",
          date: "",
          message: "",
        };
      } catch (err: any) {
        submitStatus.value = "error";
        errorMessage.value =
          err?.response?.data?.error ||
          "Une erreur s'est produite. Veuillez reessayer.";
      } finally {
        loading.value = false;
      }
    }

    function useFallbackImage(event: Event) {
      const image = event.target as HTMLImageElement;
      if (image.src !== fallbackPhoto) {
        image.src = fallbackPhoto;
      }
    }

    return {
      services,
      visibleServices,
      form,
      loading,
      submitStatus,
      errorMessage,
      submit,
      useFallbackImage,
    };
  },
});
</script>
