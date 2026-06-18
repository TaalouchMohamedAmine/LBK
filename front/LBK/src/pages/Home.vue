<template>
  <DefaultLayout>
    <section class="editorial-hero">
      <div class="hero-image">
        <img
          src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1800&q=85"
          alt="Lina Boukadida LBK bridal makeup work"
          @error="useFallbackImage"
        />
      </div>
      <div class="hero-content">
        <div class="hero-panel">
          <span class="section-kicker">Haute Couture Beaute</span>
          <h1 class="hero-title">
            Lina Boukadida <br />
            <em>Makeup Artist</em>
          </h1>
          <p class="hero-copy">
            Artiste maquilleuse professionnelle a Hammamet, specialisee dans
            les mariees voilees et non voilees, fiancailles, shooting, plateaux
            tele, defiles, tournages et soirees.
          </p>
          <div class="hero-actions">
            <router-link to="/booking" class="button button-primary button-lg">
              Reserver un rendez-vous
            </router-link>
            <router-link to="/services" class="button button-ghost button-lg">
              Decouvrir les services
            </router-link>
          </div>
          <div class="hero-metrics" aria-label="Atelier highlights">
            <div class="metric">
              <strong>10+</strong>
              <span>Annees d'expertise</span>
            </div>
            <div class="metric">
              <strong>500+</strong>
              <span>Mariees sublimees</span>
            </div>
            <div class="metric">
              <strong>1:1</strong>
              <span>Experience sur mesure</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="container-max about-grid">
        <div class="portrait-stack">
          <img
            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1000&q=85"
            alt="Lina Boukadida bridal makeup inspiration"
            @error="useFallbackImage"
          />
        </div>
        <div>
          <span class="section-kicker">A propos</span>
          <h2 class="section-title">L'art de la <em>transformation.</em></h2>
          <div class="about-copy">
            <p class="section-copy">
              Passionnee par la beaute, Lina Boukadida a commence comme
              artiste plasticienne, diplomee de l'ecole des beaux arts, avant de
              completer son regard artistique par des formations en maquillage
              professionnel.
            </p>
            <p class="section-copy">
              Au centre Lina Boukadida, la mise en beaute s'adapte au souhait
              de chaque cliente: wtiya, mariage, contrat de mariage,
              fiancailles, soins, onglerie, massage, coiffure et soins cheveux.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="page-section surface-low">
      <div class="container-max">
        <div class="bento-head">
          <span class="section-kicker">Services signature</span>
          <h2 class="section-title">Nos rituels <em>beaute.</em></h2>
        </div>
        <div class="bento-grid">
          <article
            v-for="tile in serviceTiles"
            :key="tile.title"
            :class="['service-tile', tile.size]"
          >
            <img :src="tile.image" :alt="tile.alt" @error="useFallbackImage" />
            <div class="tile-overlay">
              <h3>{{ tile.title }}</h3>
              <p>{{ tile.description }}</p>
              <router-link to="/services" class="tile-link">
                En savoir plus
              </router-link>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="page-section">
      <div class="container-max">
        <div class="page-hero-grid">
          <div>
            <span class="section-kicker">Cosmitek by LBK</span>
            <h2 class="section-title">La collection <em>exclusive.</em></h2>
            <p class="section-copy hero-copy">
              Une selection de produits inspires par le travail d'atelier:
              textures lumineuses, teintes profondes et finitions camera-ready.
            </p>
          </div>
          <router-link to="/products" class="button button-ghost button-lg">
            Explorer la boutique
          </router-link>
        </div>

        <div class="collection-grid page-section">
          <article v-for="product in products" :key="product.name" class="product">
            <div class="product-image">
              <img :src="product.image" :alt="product.alt" @error="useFallbackImage" />
            </div>
            <span class="product-label">{{ product.label }}</span>
            <h3>{{ product.name }}</h3>
            <span class="product-price">{{ product.price }}</span>
          </article>
        </div>
      </div>
    </section>
  </DefaultLayout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const fallbackPhoto =
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=85";

const serviceTiles = [
  {
    title: "Mariage Prestige",
    description: "Un accompagnement personnalise pour votre jour le plus photographie.",
    size: "large",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
    alt: "Bride with luminous bridal makeup",
  },
  {
    title: "Soirees & Evenements",
    description: "Des looks glamour, stables et lumineux jusqu'a la derniere photo.",
    size: "small",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
    alt: "Detailed evening eye makeup",
  },
  {
    title: "Cours particuliers",
    description: "Apprendre les gestes qui subliment votre visage au quotidien.",
    size: "small",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    alt: "Professional makeup brushes and cosmetics",
  },
  {
    title: "Shooting & Editorial",
    description: "Une expertise technique pour les images de mode et les campagnes.",
    size: "large",
    image:
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1400&q=85",
    alt: "Editorial model portrait",
  },
];

const products = [
  {
    label: "Edition limitee",
    name: "Rouge Signature LBK",
    price: "45,00 DT",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
    alt: "Luxury lipstick product",
  },
  {
    label: "Teint parfait",
    name: "Fond de Teint Luminesse",
    price: "62,00 DT",
    image:
      "https://images.unsplash.com/photo-1599733589046-10c005739ef1?auto=format&fit=crop&w=900&q=85",
    alt: "Foundation bottle on bright surface",
  },
  {
    label: "Best seller",
    name: "Palette Atelier Or",
    price: "58,00 DT",
    image:
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=900&q=85",
    alt: "Gold and bronze makeup palette",
  },
];

export default defineComponent({
  name: "HomePage",
  components: { DefaultLayout },
  setup() {
    function useFallbackImage(event: Event) {
      const image = event.target as HTMLImageElement;
      if (image.src !== fallbackPhoto) {
        image.src = fallbackPhoto;
      }
    }

    return { serviceTiles, products, useFallbackImage };
  },
});
</script>
