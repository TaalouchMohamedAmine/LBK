<template>
  <div class="admin-search-page">
    <div class="page-header">
      <h2 class="page-title">Résultats de recherche pour "{{ query }}"</h2>
    </div>

    <div v-if="loading" class="loading-state">Recherche en cours...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else>
      <div v-if="products.length === 0 && reservations.length === 0" class="empty-state">
        Aucun résultat trouvé pour cette recherche.
      </div>

      <div v-if="products.length > 0" class="results-section">
        <h3 class="section-title">Produits ({{ products.length }})</h3>
        <div class="table-container">
          <table class="atelier-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <div class="product-cell">
                    <img :src="product.image || 'https://placehold.co/40x40?text=No+Image'" alt="" class="product-img" />
                    <div>
                      <p class="product-name">{{ product.name }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ product.category?.name || '—' }}</td>
                <td>{{ product.price.toFixed(2) }} DT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="reservations.length > 0" class="results-section">
        <h3 class="section-title">Réservations ({{ reservations.length }})</h3>
        <div class="table-container">
          <table class="atelier-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Service</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in reservations" :key="res.id">
                <td>
                  <div class="res-client">
                    <p class="res-name">{{ res.name }}</p>
                    <p class="res-email">{{ res.email }}</p>
                  </div>
                </td>
                <td>{{ res.service }}</td>
                <td>{{ formatDate(res.preferredDate) }}</td>
                <td>
                  <span class="status-badge" :class="'status-' + res.status.toLowerCase()">
                    {{ res.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../plugins/api';

const route = useRoute();
const query = ref(route.query.q || '');
const loading = ref(false);
const error = ref('');
const products = ref<any[]>([]);
const reservations = ref<any[]>([]);

const fetchResults = async () => {
  if (!query.value) return;
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.get(`/search?q=${encodeURIComponent(query.value as string)}`);
    products.value = data.products || [];
    reservations.value = data.reservations || [];
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Erreur lors de la recherche';
  } finally {
    loading.value = false;
  }
};

watch(() => route.query.q, (newQ) => {
  query.value = newQ || '';
  fetchResults();
});

onMounted(fetchResults);

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
};
</script>

<style scoped>
.admin-search-page {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 2rem;
  font-weight: 400;
  color: #1a1c1c;
  margin: 0;
}

.loading-state, .error-state, .empty-state {
  padding: 40px;
  text-align: center;
  background: #fff;
  border: 1px solid rgba(115, 92, 0, 0.08);
  font-size: 0.95rem;
  color: #4d4635;
}
.error-state {
  color: #ba1a1a;
  background: rgba(186, 26, 26, 0.05);
  border-color: rgba(186, 26, 26, 0.2);
}

.results-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1c1c;
  margin-bottom: 16px;
}

.table-container {
  background: #fff;
  border: 1px solid rgba(115, 92, 0, 0.08);
  overflow-x: auto;
}

.atelier-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.atelier-table th {
  background: #fdfcfc;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #4d4635;
  opacity: 0.7;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(115, 92, 0, 0.08);
}

.atelier-table td {
  padding: 16px 24px;
  font-size: 0.9rem;
  color: #1a1c1c;
  border-bottom: 1px solid rgba(115, 92, 0, 0.04);
  vertical-align: middle;
}

.atelier-table tbody tr:last-child td {
  border-bottom: none;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  background: #f5f5f5;
  border-radius: 4px;
}

.product-name {
  margin: 0;
  font-weight: 600;
}

.res-client {
  display: flex;
  flex-direction: column;
}

.res-name {
  margin: 0;
  font-weight: 600;
}

.res-email {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #4d4635;
  opacity: 0.8;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 100px;
  background: #eee;
  color: #555;
}

.status-new {
  background: rgba(115, 92, 0, 0.15);
  color: #735c00;
}
.status-confirmed {
  background: rgba(34, 139, 34, 0.15);
  color: #1b5e20;
}
.status-cancelled {
  background: rgba(186, 26, 26, 0.15);
  color: #ba1a1a;
}
</style>
