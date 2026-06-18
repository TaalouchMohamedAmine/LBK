<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h1 class="page-title">Produits</h1>
      </div>
      <button class="btn-primary" @click="openModal()">+ Ajouter un produit</button>
    </div>

    <div class="table-wrap" v-if="products.length">
      <table class="data-table">
        <thead>
          <tr>
            <th>Image</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>
              <img v-if="p.image" :src="p.image" :alt="p.name" class="thumb" />
              <div v-else class="thumb-placeholder">
                <span class="material-symbols-outlined">inventory_2</span>
              </div>
            </td>
            <td>
              <strong>{{ p.name }}</strong>
              <small>{{ p.description }}</small>
            </td>
            <td>{{ p.category?.name || '—' }}</td>
            <td class="price">{{ formatPrice(p.price) }}</td>
            <td><span class="status-chip">{{ p.status }}</span></td>
            <td>
              <div class="row-actions">
                <button class="btn-icon" title="Modifier" @click="openModal(p)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="btn-icon btn-icon--danger" title="Supprimer" @click="deleteProduct(p.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <span class="material-symbols-outlined" style="font-size:48px; color:#d0c5af; margin-bottom:8px;">inventory_2</span>
      <p>Aucun produit pour l'instant.</p>
      <button class="btn-primary" @click="openModal()">Créer le premier produit</button>
    </div>

    <div v-if="loading" class="loading-state">Chargement…</div>

    <Teleport to="body">
      <div v-if="modalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>{{ editing ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
            <button class="btn-icon" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-form" @submit.prevent="saveProduct">
            <div class="form-row">
              <label>Nom * <input v-model="form.name" placeholder="Nom du produit" required /></label>
              <label>Prix * <input v-model="form.price" type="number" step="0.01" min="0" placeholder="0.00" required /></label>
            </div>
            <label>Description <textarea v-model="form.description" rows="3" placeholder="Description…" /></label>
            <div class="form-row">
              <label>
                Catégorie *
                <select v-model="form.categoryId" required>
                  <option :value="null" disabled>— Choisir —</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </label>
              <label>
                Statut
                <select v-model="form.status">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="OUT_OF_STOCK">Rupture</option>
                  <option value="DISCONTINUED">Discontinué</option>
                </select>
              </label>
            </div>
            <label>Image URL <input v-model="form.image" placeholder="https://…" /></label>
            <div class="modal-actions">
              <button type="button" class="btn-ghost" @click="closeModal">Annuler</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Enregistrement…' : (editing ? 'Mettre à jour' : 'Créer') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../plugins/api';

const emit = defineEmits(['toast']);

interface Category { id: number; name: string; }
interface Product {
  id: number; name: string; description?: string;
  price: number; status: string; categoryId: number; category?: Category; image?: string;
}

const products   = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading    = ref(false);
const saving     = ref(false);
const modalOpen  = ref(false);
const editing    = ref<Product | null>(null);
const emptyForm  = () => ({ name: '', description: '', price: '', status: 'AVAILABLE', categoryId: null as number | null, image: '' });
const form       = ref(emptyForm());

async function load() {
  loading.value = true;
  try {
    const [p, c] = await Promise.all([api.get('/products'), api.get('/categories')]);
    products.value   = p.data;
    categories.value = c.data;
  } catch (e: any) {
    emit('toast', 'Erreur de chargement : ' + (e?.message || ''), 'toast-error');
  } finally {
    loading.value = false;
  }
}

function formatPrice(v: number) {
  return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', minimumFractionDigits: 2 }).format(v);
}

function openModal(product?: Product) {
  editing.value = product || null;
  form.value    = product
    ? { name: product.name, description: product.description || '',
        price: String(product.price), status: product.status || 'AVAILABLE',
        categoryId: product.categoryId || null, image: product.image || '' }
    : emptyForm();
  modalOpen.value = true;
}

function closeModal() { modalOpen.value = false; }

async function saveProduct() {
  saving.value = true;
  try {
    if (editing.value) {
      await api.put(`/products/${editing.value.id}`, form.value);
      emit('toast', 'Produit mis à jour ✓');
    } else {
      await api.post('/products', form.value);
      emit('toast', 'Produit créé ✓');
    }
    closeModal();
    await load();
  } catch (e: any) {
    emit('toast', 'Erreur : ' + (e?.response?.data?.error || e?.message || ''), 'toast-error');
  } finally {
    saving.value = false;
  }
}

async function deleteProduct(id: number) {
  if (!confirm('Supprimer ce produit ?')) return;
  try {
    await api.delete(`/products/${id}`);
    emit('toast', 'Produit supprimé');
    await load();
  } catch (e: any) {
    emit('toast', 'Erreur suppression', 'toast-error');
  }
}

onMounted(load);
</script>

<style scoped>
/* ── Page ──────────────────────────────────────── */
.admin-page { max-width: 1200px; margin: 0 auto; }

.page-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 36px; flex-wrap: wrap; gap: 16px;
}

.page-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 300;
  color: #1a1c1c;
  line-height: 1;
  margin: 6px 0 0;
  letter-spacing: -0.01em;
}

.eyebrow {
  display: block;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #735c00;
  margin: 0;
}

/* ── Buttons ───────────────────────────────────── */
.btn-primary {
  display: inline-flex; align-items: center; min-height: 44px;
  padding: 0 24px; border: none; background: #735c00;
  color: #fff; font-family: 'Manrope', sans-serif;
  font-size: 10px; font-weight: 800; letter-spacing: 0.16em;
  text-transform: uppercase; cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #574500; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-ghost {
  display: inline-flex; align-items: center; min-height: 44px;
  padding: 0 22px; border: 1px solid rgba(115,92,0,.2);
  background: transparent; color: #4d4635;
  font-family: 'Manrope', sans-serif; font-size: 10px;
  font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; cursor: pointer; transition: background 0.2s;
}
.btn-ghost:hover { background: rgba(115,92,0,.06); }

.btn-icon {
  background: none; border: none; cursor: pointer;
  font-size: 1rem; padding: 6px;
  color: #4d4635; transition: color 0.15s, transform 0.15s;
  display: inline-flex; align-items: center; justify-content: center;
}
.btn-icon:hover { color: #735c00; transform: scale(1.12); }
.btn-icon--danger:hover { color: #ba1a1a !important; transform: scale(1.12); }

/* ── Table ─────────────────────────────────────── */
.table-wrap {
  background: #fff;
  overflow: hidden;
  box-shadow: 0 40px 60px -15px rgba(26,28,28,0.05);
}

.data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }

.data-table th {
  text-align: left; padding: 14px 18px;
  background: #f3f3f4; color: #4d4635;
  font-family: 'Manrope', sans-serif;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  border-bottom: 1px solid rgba(115,92,0,.08);
}

.data-table td {
  padding: 16px 18px;
  border-bottom: 1px solid rgba(115,92,0,.06);
  color: #1a1c1c; vertical-align: middle;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(115,92,0,.02); }
.data-table td strong { display: block; color: #1a1c1c; font-weight: 700; }
.data-table td small  { display: block; color: #4d4635; font-size: 0.78rem; margin-top: 2px; }

.thumb {
  width: 52px; height: 52px;
  object-fit: cover;
}
.thumb-placeholder {
  width: 52px; height: 52px;
  display: grid; place-items: center; font-size: 1.4rem;
  background: #f3f3f4;
}

.price {
  font-family: 'Newsreader', Georgia, serif;
  color: #735c00; font-size: 1rem; font-weight: 400;
}

.row-actions { display: flex; gap: 4px; }

.status-chip {
  display: inline-flex; align-items: center;
  padding: 3px 10px;
  font-size: 9px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  background: rgba(115,92,0,.1); color: #735c00;
}

/* ── Empty / loading ───────────────────────────── */
.empty-state, .loading-state {
  text-align: center; padding: 72px 24px; color: #4d4635;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}

/* ── Modal ─────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(26,28,28,.4);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 16px;
}

.modal-card {
  background: #fff;
  box-shadow: 0 40px 80px rgba(26,28,28,.18);
  width: 100%; max-width: 560px;
  animation: fadeUp .22s ease;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 28px 32px 20px;
  border-bottom: 1px solid rgba(115,92,0,.08);
}
.modal-header h2 {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 2rem; font-weight: 300; color: #1a1c1c; margin: 0;
}

.modal-form {
  padding: 28px 32px; display: flex; flex-direction: column; gap: 18px;
}

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.modal-form label {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: #4d4635;
}

.modal-form input,
.modal-form select,
.modal-form textarea {
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(115,92,0,.2);
  background: transparent;
  padding: 10px 0;
  color: #1a1c1c;
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
}

.modal-form input:focus,
.modal-form select:focus,
.modal-form textarea:focus {
  outline: none;
  border-bottom-color: #735c00;
  border-bottom-width: 2px;
}

.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
</style>
