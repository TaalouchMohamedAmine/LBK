<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h1 class="page-title">Catégories</h1>
      </div>
      <button class="btn-primary" @click="openModal()">+ Nouvelle catégorie</button>
    </div>

    <div class="cat-grid" v-if="categories.length">
      <div class="cat-card" v-for="c in categories" :key="c.id">
        <div class="cat-card-body">
          <div class="cat-icon">
            <span class="material-symbols-outlined">folder</span>
          </div>
          <div>
            <strong>{{ c.name }}</strong>
            <span class="badge">{{ c.products?.length || 0 }} produit(s)</span>
          </div>
        </div>
        <div class="cat-actions">
          <button class="btn-icon" title="Modifier" @click="openModal(c)">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn-icon btn-icon--danger" title="Supprimer" @click="deleteCategory(c.id)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <span class="material-symbols-outlined" style="font-size:48px; color:#d0c5af; margin-bottom:8px;">folder_open</span>
      <p>Aucune catégorie pour l'instant.</p>
      <button class="btn-primary" @click="openModal()">Créer la première catégorie</button>
    </div>

    <div v-if="loading" class="loading-state">Chargement…</div>

    <Teleport to="body">
      <div v-if="modalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h2>{{ editing ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h2>
            <button class="btn-icon" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-form" @submit.prevent="saveCategory">
            <label>Nom * <input v-model="form.name" placeholder="Nom de la catégorie" required /></label>
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

interface Category { id: number; name: string; image?: string; products?: any[]; }

const categories = ref<Category[]>([]);
const loading    = ref(false);
const saving     = ref(false);
const modalOpen  = ref(false);
const editing    = ref<Category | null>(null);
const form       = ref({ name: '', image: '' });

async function load() {
  loading.value = true;
  try {
    const { data } = await api.get('/categories');
    categories.value = data;
  } catch (e: any) {
    emit('toast', 'Erreur de chargement : ' + (e?.message || ''), 'toast-error');
  } finally {
    loading.value = false;
  }
}

function openModal(cat?: Category) {
  editing.value  = cat || null;
  form.value     = cat ? { name: cat.name, image: cat.image || '' } : { name: '', image: '' };
  modalOpen.value = true;
}

function closeModal() { modalOpen.value = false; }

async function saveCategory() {
  saving.value = true;
  try {
    if (editing.value) {
      await api.put(`/categories/${editing.value.id}`, form.value);
      emit('toast', 'Catégorie mise à jour ✓');
    } else {
      await api.post('/categories', form.value);
      emit('toast', 'Catégorie créée ✓');
    }
    closeModal();
    await load();
  } catch (e: any) {
    emit('toast', 'Erreur : ' + (e?.response?.data?.error || e?.message || ''), 'toast-error');
  } finally {
    saving.value = false;
  }
}

async function deleteCategory(id: number) {
  if (!confirm('Supprimer cette catégorie ?')) return;
  try {
    await api.delete(`/categories/${id}`);
    emit('toast', 'Catégorie supprimée');
    await load();
  } catch {
    emit('toast', 'Erreur suppression', 'toast-error');
  }
}

onMounted(load);
</script>

<style scoped>
/* ── Page ────────────────────────────────────────── */
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

/* ── Buttons ─────────────────────────────────────── */
.btn-primary {
  display: inline-flex; align-items: center; min-height: 44px;
  padding: 0 24px; border: none; background: #735c00;
  color: #fff; font-family: 'Manrope', sans-serif;
  font-size: 10px; font-weight: 800; letter-spacing: 0.16em;
  text-transform: uppercase; cursor: pointer; transition: background 0.2s;
}
.btn-primary:hover { background: #574500; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-ghost {
  display: inline-flex; align-items: center; min-height: 44px;
  padding: 0 22px; border: 1px solid rgba(115,92,0,.2);
  background: transparent; color: #4d4635;
  font-family: 'Manrope', sans-serif; font-size: 10px;
  font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  cursor: pointer; transition: background 0.2s;
}
.btn-ghost:hover { background: rgba(115,92,0,.06); }

.btn-icon {
  background: none; border: none; cursor: pointer;
  font-size: 1rem; padding: 6px; color: #4d4635;
  display: inline-flex; align-items: center; justify-content: center;
  transition: color 0.15s, transform 0.15s;
}
.btn-icon:hover { color: #735c00; transform: scale(1.12); }
.btn-icon--danger:hover { color: #ba1a1a !important; transform: scale(1.12); }

/* ── Category cards ──────────────────────────────── */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.cat-card {
  background: #fff;
  padding: 24px;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  box-shadow: 0 40px 60px -15px rgba(26,28,28,0.05);
  border-left: 4px solid rgba(208,197,175,0.5);
  transition: transform 0.4s ease, border-color 0.3s;
}
.cat-card:hover { transform: translateY(-4px); border-left-color: #735c00; }

.cat-card-body { display: flex; gap: 14px; align-items: flex-start; }

.cat-icon {
  width: 44px; height: 44px;
  background: #f3f3f4;
  display: grid; place-items: center;
  font-size: 1.3rem; flex-shrink: 0;
}

.cat-card strong {
  display: block;
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.1rem; font-weight: 400;
  color: #1a1c1c;
}

.cat-card p { color: #4d4635; font-size: 0.85rem; margin: 4px 0 8px; line-height: 1.5; }

.badge {
  display: inline-flex; align-items: center;
  padding: 3px 10px;
  background: rgba(115,92,0,.1); color: #735c00;
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cat-actions { display: flex; flex-direction: column; gap: 4px; }

.empty-state, .loading-state {
  text-align: center; padding: 72px 24px; color: #4d4635;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}

/* ── Modal ───────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(26,28,28,.4);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 16px;
}

.modal-card {
  background: #fff;
  box-shadow: 0 40px 80px rgba(26,28,28,.18);
  width: 100%; max-width: 480px;
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

.modal-form label {
  display: flex; flex-direction: column; gap: 6px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: #4d4635;
}

.modal-form input,
.modal-form textarea {
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(115,92,0,.2);
  background: transparent;
  padding: 10px 0;
  color: #1a1c1c;
  font-family: 'Manrope', sans-serif; font-size: 0.9rem;
}

.modal-form input:focus,
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
</style>
