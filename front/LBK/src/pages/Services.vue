<template>
  <DefaultLayout>
    <header class="page-hero">
      <div class="container-max page-hero-grid">
        <div>
          <span class="section-kicker">Services</span>
          <h1 class="section-title">Chaque visage, <em>une signature.</em></h1>
          <p class="section-copy hero-copy">
            Des prestations concues pour les moments qui meritent une presence
            impeccable: mariage, evenement, image professionnelle ou formation.
          </p>
        </div>
        <div class="page-hero-image">
          <img
            src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1000&q=85"
            alt="Luxury makeup service detail"
          />
          <div class="quote-note">Precision, lumiere et tenue longue duree.</div>
        </div>
      </div>
    </header>

    <section class="page-section surface-low">
      <div class="container-max service-list">
        <article v-for="service in visibleServices" :key="service.id" class="service-card">
          <div>
            <span class="section-kicker">{{ service.category }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
          <div class="service-card-footer">
            <span class="service-price">From {{ service.priceFrom }} EUR</span>
            <UiButton size="sm" variant="outline" @click="reserve(service)">
              Reserve
            </UiButton>
          </div>
        </article>
      </div>
    </section>
  </DefaultLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import UiButton from "@/components/ui/Button.vue";
import { fetchServices } from "@/services/api";

type Service = {
  id: string | number;
  title: string;
  description: string;
  priceFrom: string | number;
  category?: string;
};

const fallbackServices: Service[] = [
  {
    id: "bridal",
    category: "Mariage",
    title: "Mariage Prestige",
    description:
      "Essai, preparation peau, maquillage longue tenue et accompagnement du jour J.",
    priceFrom: 180,
  },
  {
    id: "event",
    category: "Evenement",
    title: "Soiree Signature",
    description:
      "Un look lumineux et sophistique pour diner, gala, anniversaire ou reception.",
    priceFrom: 90,
  },
  {
    id: "editorial",
    category: "Image",
    title: "Shooting Editorial",
    description:
      "Direction beaute pour photo, video, campagne, book ou contenu de marque.",
    priceFrom: 150,
  },
  {
    id: "lesson",
    category: "Formation",
    title: "Cours Particulier",
    description:
      "Une session privee pour apprendre les gestes adaptes a votre visage.",
    priceFrom: 75,
  },
  {
    id: "skincare",
    category: "Soin",
    title: "Glow Preparation",
    description:
      "Preparation de peau, hydratation, correction douce et fini naturel premium.",
    priceFrom: 65,
  },
  {
    id: "guest",
    category: "Ceremonie",
    title: "Invitee Elegance",
    description:
      "Un maquillage raffine, harmonise a votre tenue et a la lumiere du lieu.",
    priceFrom: 80,
  },
];

export default defineComponent({
  name: "ServicesPage",
  components: { DefaultLayout, UiButton },
  setup() {
    const router = useRouter();
    const services = ref<Service[]>([]);
    const visibleServices = computed(() =>
      services.value.length ? services.value : fallbackServices,
    );

    onMounted(async () => {
      const remote = await fetchServices();
      services.value = Array.isArray(remote) && remote.length ? remote : fallbackServices;
    });

    function reserve(service: Service) {
      router.push({ path: "/booking", query: { service: String(service.id) } });
    }

    return { visibleServices, reserve };
  },
});
</script>
