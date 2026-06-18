<template>
  <DefaultLayout>

    <!-- ── Page Hero ──────────────────────────────── -->
    <header class="products-hero">
      <div class="container-max hero-grid">
        <div class="hero-text">
          <p class="eyebrow">Cosmitek by LBK</p>
          <h1 class="hero-title">La collection <em>exclusive.</em></h1>
          <p class="hero-copy">
            Des produits inspirés par le travail d'atelier : textures
            lumineuses, teintes profondes et finitions caméra-ready.
            Chaque formule est sélectionnée par Lina Boukadida.
          </p>
          <div class="hero-ctas">
            <router-link to="/booking" class="btn-primary-lg">Réserver une séance</router-link>
            <router-link to="/contact" class="btn-ghost-lg">Nous contacter</router-link>
          </div>
        </div>
        <div class="hero-image-wrap">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85"
            alt="Cosmitek LBK luxury cosmetics collection"
            @error="useFallbackImage"
          />
          <div class="quote-note">
            <em>Beauté professionnelle,<br/>à votre portée.</em>
          </div>
        </div>
      </div>
    </header>

    <!-- ── Filters & Search ───────────────────────── -->
    <section class="toolbar-section">
      <div class="container-max toolbar">
        <!-- Search -->
        <div class="search-wrap">
          <span class="material-symbols-outlined search-icon">search</span>
          <input
            v-model="search"
            type="search"
            class="search-input"
            placeholder="Rechercher un produit…"
            aria-label="Rechercher un produit"
          />
        </div>

        <!-- Category pills -->
        <div class="filter-pills" role="group" aria-label="Filtrer par catégorie">
          <button
            v-for="cat in allCategories"
            :key="cat"
            :class="['pill', { 'pill--active': activeCategory === cat }]"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Sort -->
        <div class="sort-wrap">
          <span class="material-symbols-outlined sort-icon">swap_vert</span>
          <select v-model="sortBy" class="sort-select" aria-label="Trier les produits">
            <option value="default">Trier par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="name">Nom A–Z</option>
          </select>
        </div>
      </div>
    </section>

    <!-- ── Product Grid ──────────────────────────── -->
    <section class="products-section">
      <div class="container-max">

        <!-- Count -->
        <div class="count-bar" v-if="!loading">
          <p class="products-count">
            <strong>{{ filteredProducts.length }}</strong>
            produit{{ filteredProducts.length !== 1 ? 's' : '' }} trouvé{{ filteredProducts.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Loading skeletons -->
        <div v-if="loading" class="products-grid">
          <div v-for="n in 6" :key="n" class="product-card skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="product-card-body">
              <div class="skeleton skeleton-line short"></div>
              <div class="skeleton skeleton-line"></div>
              <div class="skeleton skeleton-line medium"></div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <span class="material-symbols-outlined empty-icon">search_off</span>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez une autre recherche ou catégorie.</p>
          <button class="btn-primary-lg" @click="resetFilters">Réinitialiser les filtres</button>
        </div>

        <!-- Products -->
        <div v-else class="products-grid">
          <article
            v-for="product in filteredProducts"
            :key="product.id ?? product.name"
            class="product-card"
          >
            <div class="product-card-image">
              <img
                :src="product.image || fallbackPhoto"
                :alt="product.name"
                @error="useFallbackImage"
                loading="lazy"
              />
              <!-- Status badge -->
              <span
                v-if="product.status && product.status !== 'AVAILABLE'"
                :class="['status-badge', product.status === 'OUT_OF_STOCK' ? 'status-badge--out' : 'status-badge--disc']"
              >
                {{ product.status === 'OUT_OF_STOCK' ? 'Rupture de stock' : 'Discontinué' }}
              </span>
              <!-- Category badge -->
              <span v-if="product.category?.name" class="category-badge">
                {{ product.category.name }}
              </span>
            </div>

            <div class="product-card-body">
              <span v-if="product.brand?.name" class="product-brand">{{ product.brand.name }}</span>
              <h3 class="product-name">{{ product.name }}</h3>
              <p v-if="product.description" class="product-desc">{{ product.description }}</p>
              <div class="product-card-footer">
                <span class="product-price">{{ formatPrice(product.price) }} <small>DT</small></span>
                <button
                  class="btn-reserve"
                  :disabled="product.status === 'OUT_OF_STOCK' || product.status === 'DISCONTINUED'"
                  @click="openPayment(product)"
                >
                  <span class="material-symbols-outlined" style="font-size:16px;">shopping_bag</span>
                  Acheter
                </button>
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>

    <!-- ── CTA Banner ─────────────────────────────── -->
    <section class="cta-section">
      <div class="container-max">
        <div class="cta-banner">
          <div class="cta-text">
            <p class="eyebrow">Atelier LBK</p>
            <h2 class="cta-title">Une question sur un <em>produit ?</em></h2>
            <p class="cta-copy">Contactez l'atelier pour des conseils personnalisés.</p>
          </div>
          <div class="cta-actions">
            <router-link to="/contact" class="btn-primary-lg">
              <span class="material-symbols-outlined" style="font-size:16px;">mail</span>
              Contacter l'atelier
            </router-link>
            <router-link to="/booking" class="btn-ghost-lg">Réserver</router-link>
          </div>
        </div>
      </div>
    </section>

  </DefaultLayout>

  <!-- ── Payment Modal ───────────────────────────── -->
  <Teleport to="body">
    <div v-if="paymentProduct" class="pay-overlay" @click.self="closePayment">
      <div class="pay-modal" role="dialog" aria-modal="true">

        <!-- Modal header -->
        <div class="pay-header">
          <div>
            <p class="pay-eyebrow">Paiement sécurisé</p>
            <h2 class="pay-title">{{ paymentProduct.name }}</h2>
          </div>
          <button class="pay-close" @click="closePayment">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Order summary -->
        <div class="pay-summary">
          <div class="pay-summary-row">
            <span>{{ paymentProduct.name }}</span>
            <span>{{ formatPrice(paymentProduct.price) }} DT</span>
          </div>
          <div class="pay-summary-row pay-summary-row--total">
            <span>Total</span>
            <span class="pay-total">{{ formatPrice(paymentProduct.price) }} DT</span>
          </div>
        </div>

        <!-- Payment form -->
        <form class="pay-form" @submit.prevent="submitPayment">
          <p class="pay-section-label">Informations personnelles</p>
          <div class="pay-row">
            <label class="pay-field">
              <span>Nom complet</span>
              <input v-model="payForm.name" required placeholder="Prénom Nom" />
            </label>
            <label class="pay-field">
              <span>Email</span>
              <input v-model="payForm.email" type="email" required placeholder="votre@email.com" />
            </label>
          </div>
          <label class="pay-field">
            <span>Adresse de livraison</span>
            <input v-model="payForm.address" required placeholder="Rue, Ville, Code postal" />
          </label>

          <p class="pay-section-label" style="margin-top:20px;">
            <span class="material-symbols-outlined" style="font-size:14px;vertical-align:middle;">lock</span>
            Informations de paiement
          </p>
          <label class="pay-field">
            <span>Numéro de carte</span>
            <div class="card-input-wrap">
              <span class="material-symbols-outlined card-icon">credit_card</span>
              <input
                v-model="payForm.card"
                required
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                @input="formatCard"
              />
            </div>
          </label>
          <div class="pay-row">
            <label class="pay-field">
              <span>Expiration</span>
              <input v-model="payForm.expiry" required maxlength="5" placeholder="MM/AA" @input="formatExpiry" />
            </label>
            <label class="pay-field">
              <span>CVV</span>
              <input v-model="payForm.cvv" required maxlength="3" placeholder="123" type="password" />
            </label>
          </div>

          <!-- Success / Error feedback -->
          <div v-if="payStatus === 'success'" class="pay-feedback pay-feedback--success">
            <span class="material-symbols-outlined">check_circle</span>
            Paiement accepté ! Vous recevrez une confirmation par email.
          </div>
          <div v-if="payStatus === 'error'" class="pay-feedback pay-feedback--error">
            <span class="material-symbols-outlined">error</span>
            Une erreur est survenue. Vérifiez vos informations.
          </div>

          <button type="submit" class="pay-submit" :disabled="payLoading || payStatus === 'success'">
            <span v-if="payLoading" class="material-symbols-outlined spin">autorenew</span>
            <span v-else class="material-symbols-outlined">lock</span>
            {{ payLoading ? 'Traitement…' : 'Payer ' + formatPrice(paymentProduct.price) + ' DT' }}
          </button>

          <p class="pay-secure-note">
            <span class="material-symbols-outlined" style="font-size:13px;">verified_user</span>
            Paiement 100% sécurisé · Données chiffrées SSL
          </p>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import { fetchProducts } from "@/services/api";

export const fallbackPhoto =
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=85";

type Product = {
  id?: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  status?: string;
  category?: { name: string };
  brand?: { name: string };
};

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Rouge Signature LBK",
    description: "Rouge à lèvres longue tenue, inspiré des mariées LBK.",
    price: 45,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85",
    status: "AVAILABLE",
    category: { name: "Lèvres" },
    brand: { name: "Cosmitek" },
  },
  {
    id: 2,
    name: "Fond de Teint Luminesse",
    description: "Couvrance parfaite pour un teint caméra-ready toute la journée.",
    price: 62,
    image: "https://images.unsplash.com/photo-1599733589046-10c005739ef1?auto=format&fit=crop&w=900&q=85",
    status: "AVAILABLE",
    category: { name: "Teint" },
    brand: { name: "Cosmitek" },
  },
  {
    id: 3,
    name: "Palette Atelier Or",
    description: "12 teintes dorées et bronze pour un regard de lumière.",
    price: 58,
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=900&q=85",
    status: "AVAILABLE",
    category: { name: "Yeux" },
    brand: { name: "Cosmitek" },
  },
  {
    id: 4,
    name: "Highlighter Prestige",
    description: "Enlumineur nacré pour un effet bonne mine éclatant.",
    price: 39,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85",
    status: "AVAILABLE",
    category: { name: "Teint" },
    brand: { name: "Cosmitek" },
  },
  {
    id: 5,
    name: "Mascara Noir Intense",
    description: "Volume et courbe, résistant aux larmes de joie.",
    price: 28,
    image: "https://images.unsplash.com/photo-1631214500004-40a6f1a47ef1?auto=format&fit=crop&w=900&q=85",
    status: "AVAILABLE",
    category: { name: "Yeux" },
    brand: { name: "Cosmitek" },
  },
  {
    id: 6,
    name: "Fixer Spray Pro",
    description: "Fixateur professionnel longue tenue, fini naturel.",
    price: 32,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85",
    status: "AVAILABLE",
    category: { name: "Finition" },
    brand: { name: "Cosmitek" },
  },
];

export default defineComponent({
  name: "ProductsPage",
  components: { DefaultLayout },
  setup() {
    const products = ref<Product[]>([]);
    const loading = ref(true);
    const search = ref("");
    const activeCategory = ref("Tous");
    const sortBy = ref("default");

    onMounted(async () => {
      const remote = await fetchProducts();
      products.value =
        Array.isArray(remote) && remote.length ? remote : fallbackProducts;
      loading.value = false;
    });

    const allCategories = computed(() => {
      const cats = new Set<string>(["Tous"]);
      products.value.forEach((p) => {
        if (p.category?.name) cats.add(p.category.name);
      });
      return Array.from(cats);
    });

    const filteredProducts = computed(() => {
      let list = products.value;
      if (activeCategory.value !== "Tous") {
        list = list.filter((p) => p.category?.name === activeCategory.value);
      }
      const q = search.value.toLowerCase().trim();
      if (q) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.brand?.name.toLowerCase().includes(q),
        );
      }
      const sorted = [...list];
      if (sortBy.value === "price-asc") sorted.sort((a, b) => a.price - b.price);
      else if (sortBy.value === "price-desc") sorted.sort((a, b) => b.price - a.price);
      else if (sortBy.value === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
      return sorted;
    });

    function resetFilters() {
      search.value = "";
      activeCategory.value = "Tous";
      sortBy.value = "default";
    }

    function formatPrice(price: number | string) {
      return Number(price).toFixed(2);
    }

    function useFallbackImage(event: Event) {
      const img = event.target as HTMLImageElement;
      if (img.src !== fallbackPhoto) img.src = fallbackPhoto;
    }

    // ── Payment modal ───────────────────────────────────
    const paymentProduct = ref<Product | null>(null);
    const payLoading = ref(false);
    const payStatus = ref<'idle' | 'success' | 'error'>('idle');
    const payForm = ref({ name: '', email: '', address: '', card: '', expiry: '', cvv: '' });

    function openPayment(product: Product) {
      paymentProduct.value = product;
      payStatus.value = 'idle';
      payForm.value = { name: '', email: '', address: '', card: '', expiry: '', cvv: '' };
      document.body.style.overflow = 'hidden';
    }

    function closePayment() {
      paymentProduct.value = null;
      document.body.style.overflow = '';
    }

    function formatCard(e: Event) {
      let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 16);
      payForm.value.card = v.replace(/(\d{4})/g, '$1 ').trim();
    }

    function formatExpiry(e: Event) {
      let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
      payForm.value.expiry = v;
    }

    async function submitPayment() {
      payLoading.value = true;
      payStatus.value = 'idle';
      // Simulate payment processing (replace with real payment gateway)
      await new Promise(r => setTimeout(r, 1800));
      // Simple validation: card must be 19 chars (formatted), expiry MM/AA, cvv 3 digits
      const cardOk = payForm.value.card.replace(/\s/g, '').length === 16;
      const cvvOk  = payForm.value.cvv.length === 3;
      if (cardOk && cvvOk) {
        payStatus.value = 'success';
        setTimeout(closePayment, 3500);
      } else {
        payStatus.value = 'error';
      }
      payLoading.value = false;
    }

    return {
      products, loading, search, activeCategory, sortBy,
      allCategories, filteredProducts, fallbackPhoto,
      resetFilters, formatPrice, useFallbackImage,
      paymentProduct, payForm, payLoading, payStatus,
      openPayment, closePayment, formatCard, formatExpiry, submitPayment,
    };
  },
});
</script>

<style scoped>
/* ── Variables local ──────────────────────────────── */
.eyebrow {
  display: block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #735c00;
  margin: 0 0 16px;
}

/* ── Hero ──────────────────────────────────────────── */
.products-hero {
  padding: clamp(80px, 12vw, 140px) 0 clamp(60px, 8vw, 100px);
  background: #f9f9f9;
  overflow: hidden;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(280px, 7fr) minmax(260px, 5fr);
  gap: clamp(40px, 8vw, 100px);
  align-items: center;
}

.hero-text { display: flex; flex-direction: column; }

.hero-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(52px, 8vw, 96px);
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 0.92;
  color: #1a1c1c;
  margin: 0 0 28px;
}

.hero-title em {
  color: #735c00;
  font-style: italic;
}

.hero-copy {
  color: #4d4635;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.85;
  margin: 0 0 40px;
  max-width: 520px;
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

/* Buttons */
.btn-primary-lg {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 0 32px;
  background: #735c00;
  color: #fff;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.22s;
  border: none;
  cursor: pointer;
}
.btn-primary-lg:hover { background: #574500; }

.btn-ghost-lg {
  display: inline-flex;
  align-items: center;
  min-height: 52px;
  padding: 0 28px;
  border: 1px solid rgba(115, 92, 0, 0.25);
  color: #4d4635;
  background: transparent;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.22s, border-color 0.22s;
  cursor: pointer;
}
.btn-ghost-lg:hover {
  background: rgba(115, 92, 0, 0.05);
  border-color: #735c00;
}

/* Hero image */
.hero-image-wrap {
  position: relative;
}

.hero-image-wrap img {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  filter: grayscale(0.15);
  transition: filter 500ms ease;
}

.hero-image-wrap:hover img { filter: grayscale(0); }

.quote-note {
  position: absolute;
  left: -28px;
  bottom: -28px;
  max-width: 260px;
  padding: 24px 28px;
  background: #d4af37;
  color: #241a00;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.3rem;
  line-height: 1.25;
}

/* ── Toolbar ──────────────────────────────────────── */
.toolbar-section {
  background: #f3f3f4;
  border-top: 1px solid rgba(115, 92, 0, 0.08);
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
  padding: 20px 0;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid rgba(115, 92, 0, 0.14);
  padding: 0 16px;
  flex: 1;
  min-width: 220px;
  max-width: 440px;
}

.search-icon {
  color: rgba(77, 70, 53, 0.5);
  font-size: 18px;
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: transparent;
  padding: 12px 0;
  outline: none;
  width: 100%;
  color: #1a1c1c;
  font-family: 'Manrope', sans-serif;
  font-size: 0.875rem;
}
.search-input::placeholder { color: rgba(77, 70, 53, 0.4); }

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
}

.pill {
  padding: 8px 16px;
  border: 1px solid rgba(115, 92, 0, 0.18);
  background: #fff;
  color: #4d4635;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.18s;
}

.pill:hover {
  color: #735c00;
  border-color: #735c00;
  background: rgba(115, 92, 0, 0.04);
}

.pill--active {
  background: #735c00;
  color: #fff;
  border-color: #735c00;
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid rgba(115, 92, 0, 0.14);
  padding: 0 14px;
}

.sort-icon { color: rgba(77, 70, 53, 0.5); font-size: 18px; }

.sort-select {
  border: none;
  background: transparent;
  padding: 11px 0;
  color: #1a1c1c;
  font-family: 'Manrope', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
}

/* ── Products section ─────────────────────────────── */
.products-section {
  padding: clamp(60px, 8vw, 100px) 0;
  background: #f9f9f9;
}

.count-bar {
  margin-bottom: 36px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
}

.products-count {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4d4635;
  margin: 0;
}

.products-count strong {
  color: #735c00;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 300;
  margin-right: 4px;
  vertical-align: baseline;
}

/* ── Grid ─────────────────────────────────────────── */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 3vw, 40px);
}

/* ── Card ─────────────────────────────────────────── */
.product-card {
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 40px 60px -15px rgba(26, 28, 28, 0.05);
  transition: transform 0.45s ease;
}

.product-card:hover { transform: translateY(-6px); }

.product-card-image {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f3f3f4;
}

.product-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-card-image img { transform: scale(1.06); }

/* Badges */
.status-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 4px 10px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.status-badge--out {
  background: rgba(186, 26, 26, 0.1);
  color: #ba1a1a;
}

.status-badge--disc {
  background: rgba(77, 70, 53, 0.1);
  color: #4d4635;
}

.category-badge {
  position: absolute;
  bottom: 14px;
  right: 14px;
  padding: 4px 10px;
  background: rgba(249, 249, 249, 0.9);
  backdrop-filter: blur(8px);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #735c00;
}

/* Card body */
.product-card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.product-brand {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #735c00;
}

.product-name {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 300;
  color: #1a1c1c;
  margin: 0;
  line-height: 1.2;
}

.product-desc {
  font-size: 0.85rem;
  color: #4d4635;
  line-height: 1.7;
  margin: 0;
  flex: 1;
}

.product-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(115, 92, 0, 0.08);
}

.product-price {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #735c00;
  line-height: 1;
}

.product-price small {
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.1em;
  opacity: 0.7;
  font-family: 'Manrope', sans-serif;
}

.btn-reserve {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 16px;
  background: #735c00;
  color: #fff;
  font-family: 'Manrope', sans-serif;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.2s;
  flex-shrink: 0;
}
.btn-reserve:hover { background: #574500; }

/* ── Skeleton ─────────────────────────────────────── */
.skeleton-card { pointer-events: none; }

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(115, 92, 0, 0.06) 25%,
    rgba(115, 92, 0, 0.12) 50%,
    rgba(115, 92, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.skeleton-img { width: 100%; aspect-ratio: 3 / 4; }
.skeleton-line { height: 14px; margin: 8px 0; width: 100%; }
.skeleton-line.short { width: 40%; }
.skeleton-line.medium { width: 65%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty state ──────────────────────────────────── */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #4d4635;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  font-size: 64px;
  color: #d0c5af;
  display: block;
}

.empty-state h3 {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 2rem;
  font-weight: 300;
  color: #1a1c1c;
  margin: 0;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
  color: #4d4635;
}

/* ── CTA Banner ───────────────────────────────────── */
.cta-section {
  background: #f3f3f4;
  border-top: 1px solid rgba(115, 92, 0, 0.08);
  padding: clamp(60px, 8vw, 100px) 0;
}

.cta-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.cta-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 300;
  color: #1a1c1c;
  margin: 8px 0 12px;
  letter-spacing: -0.01em;
  line-height: 1;
}

.cta-title em {
  color: #735c00;
  font-style: italic;
}

.cta-copy {
  color: #4d4635;
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 0;
}

.cta-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr; }
  .hero-image-wrap { display: none; }
  .cta-banner { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 640px) {
  .products-grid { grid-template-columns: 1fr; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .search-wrap { max-width: 100%; }
}

/* ── Payment Modal ─────────────────────────────────── */
.pay-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(26, 28, 28, 0.72);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
  animation: fadeIn 0.22s ease;
}

.pay-modal {
  background: #fff;
  width: 100%; max-width: 560px;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 60px 100px -20px rgba(26, 28, 28, 0.4);
  animation: slideUp 0.3s ease;
}

/* Header */
.pay-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 12px;
  padding: 28px 32px 20px;
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
}

.pay-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 0.22em;
  text-transform: uppercase; color: #735c00; margin: 0 0 6px;
}

.pay-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.6rem; font-weight: 300;
  color: #1a1c1c; margin: 0; line-height: 1.1;
}

.pay-close {
  background: none; border: none; cursor: pointer;
  padding: 4px; color: #4d4635;
  display: inline-flex; align-items: center;
  transition: color 0.15s; flex-shrink: 0;
}
.pay-close:hover { color: #1a1c1c; }

/* Order summary */
.pay-summary {
  background: #f3f3f4;
  padding: 16px 32px;
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
}

.pay-summary-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 0.875rem; color: #4d4635; padding: 4px 0;
}

.pay-summary-row--total {
  border-top: 1px solid rgba(115, 92, 0, 0.1);
  margin-top: 8px; padding-top: 12px; font-weight: 700; color: #1a1c1c;
}

.pay-total {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.4rem; font-weight: 300; color: #735c00;
}

/* Form */
.pay-form { padding: 24px 32px 28px; display: flex; flex-direction: column; gap: 14px; }

.pay-section-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: #4d4635; margin: 0;
}

.pay-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.pay-field {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; color: #4d4635;
}

.pay-field input {
  border: 1px solid rgba(115, 92, 0, 0.2);
  background: #fff;
  padding: 11px 14px;
  font-family: 'Manrope', sans-serif;
  font-size: 0.875rem; color: #1a1c1c;
  outline: none; transition: border-color 0.18s;
  width: 100%; box-sizing: border-box;
}
.pay-field input:focus { border-color: #735c00; }
.pay-field input::placeholder { color: rgba(77, 70, 53, 0.4); }

/* Card input */
.card-input-wrap {
  display: flex; align-items: center;
  border: 1px solid rgba(115, 92, 0, 0.2);
  background: #fff;
  transition: border-color 0.18s;
}
.card-input-wrap:focus-within { border-color: #735c00; }
.card-icon { padding: 0 12px; color: rgba(77, 70, 53, 0.5); font-size: 20px; flex-shrink: 0; }
.card-input-wrap input { border: none; flex: 1; padding: 11px 14px 11px 0; }
.card-input-wrap input:focus { border: none; }

/* Feedback */
.pay-feedback {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px; font-size: 0.875rem; font-weight: 600;
  animation: fadeIn 0.25s ease;
}
.pay-feedback--success { background: rgba(34, 160, 80, 0.08); color: #22a050; }
.pay-feedback--error   { background: rgba(186, 26, 26, 0.07); color: #ba1a1a; }

/* Submit */
.pay-submit {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 54px; padding: 0 28px;
  background: #735c00; color: #fff;
  font-family: 'Manrope', sans-serif;
  font-size: 10px; font-weight: 800;
  letter-spacing: 0.2em; text-transform: uppercase;
  border: none; cursor: pointer;
  transition: background 0.2s; margin-top: 6px;
  width: 100%;
}
.pay-submit:hover:not(:disabled) { background: #574500; }
.pay-submit:disabled { opacity: 0.55; cursor: not-allowed; }

/* Secure note */
.pay-secure-note {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: 10px; color: #4d4635; text-align: center; margin: 0;
  opacity: 0.7;
}

/* Spinner */
.spin { animation: rotate 0.9s linear infinite; display: inline-block; }

@keyframes rotate { to { transform: rotate(360deg); } }

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 560px) {
  .pay-modal { max-height: 100vh; }
  .pay-header, .pay-form { padding-left: 20px; padding-right: 20px; }
  .pay-summary { padding-left: 20px; padding-right: 20px; }
  .pay-row { grid-template-columns: 1fr; }
}
</style>

