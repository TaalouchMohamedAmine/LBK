<template>
  <DefaultLayout>
    <header class="page-hero">
      <div class="container-max">
        <span class="section-kicker">Galerie</span>
        <h1 class="section-title">Textures, lumiere, <em>presence.</em></h1>
        <p class="section-copy hero-copy">
          Une selection de looks beaute, mariages et images editoriales, pensee
          comme un moodboard vivant de l'atelier.
        </p>
      </div>
    </header>

    <section class="page-section">
      <div class="container-max gallery-grid">
        <figure v-for="item in visibleGallery" :key="item.id" class="gallery-item">
          <img :src="item.image" :alt="item.title" />
          <figcaption class="gallery-caption">
            <span class="gallery-label">{{ item.label }}</span>
            <h3>{{ item.title }}</h3>
          </figcaption>
        </figure>
      </div>
    </section>
  </DefaultLayout>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { fetchGallery } from "@/services/api";

type GalleryItem = {
  id: string | number;
  title: string;
  image: string;
  label?: string;
};

const fallbackGallery: GalleryItem[] = [
  {
    id: "bridal-glow",
    title: "Bridal Glow",
    label: "Mariage",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "gold-detail",
    title: "Gold Detail",
    label: "Editorial",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "soft-glam",
    title: "Soft Glam",
    label: "Evenement",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "atelier-tools",
    title: "Atelier Tools",
    label: "Studio",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "evening-eye",
    title: "Evening Eye",
    label: "Soiree",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "clean-skin",
    title: "Clean Skin",
    label: "Soin",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85",
  },
];

export default defineComponent({
  name: "GalleryPage",
  components: { DefaultLayout },
  setup() {
    const gallery = ref<GalleryItem[]>([]);
    const visibleGallery = computed(() =>
      gallery.value.length
        ? gallery.value.map((item) => ({ label: "Atelier", ...item }))
        : fallbackGallery,
    );

    onMounted(async () => {
      const remote = await fetchGallery();
      gallery.value = Array.isArray(remote) && remote.length ? remote : fallbackGallery;
    });

    return { visibleGallery };
  },
});
</script>
