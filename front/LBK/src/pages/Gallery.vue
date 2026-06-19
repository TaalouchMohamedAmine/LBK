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
          <img :src="item.image" :alt="item.title" @error="useFallbackImage" />
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
import { defineComponent, onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import api from "@/plugins/api";

const fallbackPhoto =
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=85";

type GalleryItem = {
  id: string | number;
  title: string;
  image: string;
  label?: string;
};

const fallbackGallery: GalleryItem[] = [
  {
    id: "bridal-1",
    title: "Mariage LBK",
    label: "Mariage",
    image: "/insta2.jpg",
  },
  {
    id: "evening-1",
    title: "Soiree Elegance",
    label: "Soiree",
    image: "/insta3.jpg",
  },
  {
    id: "bridal-2",
    title: "Mariage Prestige",
    label: "Mariage",
    image: "/insta5.jpg",
  },
  {
    id: "makeup-tools",
    title: "Atelier Tools",
    label: "Studio",
    image: "/insta4.png",
  },
  {
    id: "editorial-1",
    title: "Editorial Look",
    label: "Shooting",
    image: "/insta1.jpg",
  },
  {
    id: "bridal-3",
    title: "Douceur de Mariee",
    label: "Mariage",
    image: "/insta6.png",
  },
];

export default defineComponent({
  name: "GalleryPage",
  components: { DefaultLayout },
  setup() {
    const visibleGallery = ref(fallbackGallery);

    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        if (data && data.length > 0) {
          visibleGallery.value = data.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            label: item.category,
            image: getImageUrl(item.image)
          }));
        }
      } catch (err) {
        console.error("Failed to load gallery from API", err);
      }
    };

    const getImageUrl = (url: string) => {
      if (url.startsWith('http')) return url;
      const baseUrl = import.meta.env.VITE_API_BASE || '';
      return `${baseUrl}/api${url}`;
    };

    onMounted(() => {
      fetchGallery();
    });

    function useFallbackImage(event: Event) {
      const image = event.target as HTMLImageElement;
      if (image.src !== fallbackPhoto) {
        image.src = fallbackPhoto;
      }
    }

    return { visibleGallery, useFallbackImage };
  },
});
</script>
