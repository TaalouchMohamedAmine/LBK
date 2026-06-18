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
            alt="Lina Boukadida bridal makeup service"
            @error="useFallbackImage"
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
            <span class="service-price">À partir de {{ service.priceFrom }} DT</span>
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

const fallbackPhoto =
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=85";

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
      "Mise en beaute pour mariees voilees et non voilees, avec inspiration adaptee a chaque robe et ceremonie.",
    priceFrom: 180,
  },
  {
    id: "event",
    category: "Evenement",
    title: "Fiancailles & Soiree",
    description:
      "Look lumineux et sophistique pour fiancailles, contrat de mariage, diner, gala ou reception.",
    priceFrom: 90,
  },
  {
    id: "editorial",
    category: "Image",
    title: "Shooting, Defile & TV",
    description:
      "Mise en beaute professionnelle pour shooting, plateaux tele, defiles et tournages.",
    priceFrom: 150,
  },
  {
    id: "lesson",
    category: "Formation",
    title: "Beaute Finale",
    description:
      "Finition precise du teint, regard et levres pour une presence impeccable jusqu'a la derniere photo.",
    priceFrom: 75,
  },
  {
    id: "skincare",
    category: "Soin",
    title: "Soins & Onglerie",
    description:
      "Services complementaires pour le grand jour: soins esthetiques, onglerie, massage et soins cheveux.",
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

    function useFallbackImage(event: Event) {
      const image = event.target as HTMLImageElement;
      if (image.src !== fallbackPhoto) {
        image.src = fallbackPhoto;
      }
    }

    return { visibleServices, reserve, useFallbackImage };
  },
});
</script>
