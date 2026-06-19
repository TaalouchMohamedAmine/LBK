<template>
  <div class="admin-page">
    <header class="admin-header">
      <div>
        <h1 class="admin-title">Gestion de la Galerie</h1>
        <p class="admin-subtitle">Gérez les photos affichées sur votre galerie publique.</p>
      </div>
      <button class="button button-primary" @click="openUploadModal">
        <span class="material-symbols-outlined">add_photo_alternate</span>
        Ajouter une photo
      </button>
    </header>

    <div class="gallery-grid">
      <div v-if="loading" class="loading-state">Chargement...</div>
      <div v-else-if="items.length === 0" class="empty-state">
        <span class="material-symbols-outlined empty-icon">image_not_supported</span>
        <p>Aucune photo dans la galerie.</p>
      </div>
      <article v-else v-for="item in items" :key="item.id" class="gallery-card">
        <div class="card-image-wrap">
          <img :src="getImageUrl(item.image)" :alt="item.title" class="card-image" />
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ item.title }}</h3>
          <span class="card-label">{{ item.category }}</span>
          <div class="card-actions">
            <button class="icon-button delete" @click="deleteItem(item.id)" title="Supprimer">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- Upload Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <header class="modal-header">
          <h2>Ajouter une photo</h2>
          <button class="icon-button" @click="closeModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>
        <form @submit.prevent="submitUpload" class="modal-body">
          <div class="form-group">
            <label>Titre de l'image</label>
            <input v-model="uploadForm.title" type="text" placeholder="Ex: Mariage Prestige" required />
          </div>
          <div class="form-group">
            <label>Catégorie / Tag</label>
            <input v-model="uploadForm.category" type="text" placeholder="Ex: Mariage, Soirée..." />
          </div>
          <div class="form-group">
            <label>Fichier image</label>
            <input type="file" ref="fileInput" accept="image/*" required />
          </div>
          <div class="modal-footer">
            <button type="button" class="button button-ghost" @click="closeModal">Annuler</button>
            <button type="submit" class="button button-primary" :disabled="uploading">
              {{ uploading ? 'Envoi...' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/plugins/api';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

const items = ref<GalleryItem[]>([]);
const loading = ref(true);
const showModal = ref(false);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const uploadForm = ref({
  title: '',
  category: '',
});

const emit = defineEmits(['toast']);

async function fetchItems() {
  try {
    loading.value = true;
    const res = await api.get('/gallery');
    items.value = res.data;
  } catch (err) {
    emit('toast', 'Erreur lors du chargement de la galerie', 'toast-error');
  } finally {
    loading.value = false;
  }
}

function getImageUrl(url: string) {
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_BASE || '';
  return `${baseUrl}/api${url}`;
}

function openUploadModal() {
  uploadForm.value = { title: '', category: '' };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function submitUpload() {
  if (!fileInput.value?.files?.length) {
    emit('toast', 'Veuillez sélectionner une image', 'toast-error');
    return;
  }

  const file = fileInput.value.files[0];
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', uploadForm.value.title);
  formData.append('label', uploadForm.value.category);

  try {
    uploading.value = true;
    await api.post('/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    emit('toast', 'Image ajoutée avec succès !', 'toast-success');
    closeModal();
    fetchItems();
  } catch (err) {
    emit('toast', 'Erreur lors de l\'envoi de l\'image', 'toast-error');
  } finally {
    uploading.value = false;
  }
}

async function deleteItem(id: number) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) return;

  try {
    await api.delete(`/gallery/${id}`);
    emit('toast', 'Image supprimée', 'toast-success');
    fetchItems();
  } catch (err) {
    emit('toast', 'Erreur lors de la suppression', 'toast-error');
  }
}

onMounted(() => {
  fetchItems();
});
</script>

<style scoped>
.admin-page {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.admin-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 2rem;
  font-weight: 400;
  color: #1a1c1c;
  margin: 0 0 8px;
}

.admin-subtitle {
  color: #4d4635;
  margin: 0;
  font-size: 0.95rem;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: all 0.2s;
}

.button-primary {
  background: #735c00;
  color: white;
}

.button-primary:hover {
  background: #574500;
}

.button-ghost {
  background: transparent;
  color: #4d4635;
}

.button-ghost:hover {
  background: rgba(115, 92, 0, 0.08);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.gallery-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid rgba(115, 92, 0, 0.1);
  transition: transform 0.2s;
}

.gallery-card:hover {
  transform: translateY(-4px);
}

.card-image-wrap {
  aspect-ratio: 4/5;
  overflow: hidden;
  background: #f3f3f4;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1c1c;
}

.card-label {
  font-size: 0.85rem;
  color: #735c00;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.card-actions {
  position: absolute;
  top: 16px;
  right: 16px;
}

.icon-button {
  background: white;
  border: 1px solid #eee;
  color: #ba1a1a;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-button:hover {
  background: #ba1a1a;
  color: white;
}

.loading-state, .empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 0;
  color: #4d4635;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
  margin-bottom: 16px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  padding: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1c1c;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #4d4635;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
}
</style>
