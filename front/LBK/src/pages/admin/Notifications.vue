<template>
  <div class="admin-page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h1 class="page-title">Messages</h1>
      </div>
      <div class="header-pills">
        <div class="pill active">
          Messages
          <span class="pill-badge">{{ unreadMessages }}</span>
        </div>
      </div>
    </div>

    <!-- Real-time badge -->
    <div v-if="liveAlert" class="live-alert">
      <span class="material-symbols-outlined">notifications_active</span>
      {{ liveAlert }}
    </div>

    <!-- Messages list -->
    <div v-if="!loading">
      <div v-if="messages.length" class="notif-list">
        <div
          v-for="m in messages"
          :key="m.id"
          class="notif-item"
          :class="{ unread: !m.read }"
        >
          <div class="notif-icon">
            <span class="material-symbols-outlined">mail</span>
          </div>
          <div class="notif-body">
            <p>{{ m.content }}</p>
            <time>{{ formatDate(m.createdAt) }}</time>
          </div>
          <div class="notif-actions">
            <button v-if="!m.read" class="btn-icon" title="Marquer comme lu" @click="markRead(m.id)">
              <span class="material-symbols-outlined">check_circle</span>
            </button>
            <button class="btn-icon btn-icon--danger" title="Supprimer" @click="deleteMessage(m.id)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <span class="material-symbols-outlined" style="font-size:48px; color:#d0c5af;">mark_email_read</span>
        <p>Aucun message pour l'instant.</p>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <span class="material-symbols-outlined spin">autorenew</span>
      Chargement…
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import api from '../../plugins/api';
import socket from '../../plugins/socket';

const emit = defineEmits(['toast', 'unread']);

interface Message { id: number; content: string; read: boolean; createdAt: string; }

const messages  = ref<Message[]>([]);
const loading   = ref(false);
const liveAlert = ref('');

const unreadMessages = computed(() => messages.value.filter(m => !m.read).length);

async function load() {
  loading.value = true;
  try {
    const { data } = await api.get('/notifications');
    messages.value = data.messages ?? [];
    emit('unread', unreadMessages.value);
  } catch {
    emit('toast', 'Erreur de chargement', 'toast-error');
  } finally {
    loading.value = false;
  }
}

async function markRead(id: number) {
  try {
    await api.patch(`/notifications/messages/${id}/read`);
    const m = messages.value.find(m => m.id === id);
    if (m) m.read = true;
    emit('unread', unreadMessages.value);
  } catch {
    emit('toast', 'Erreur', 'toast-error');
  }
}

async function deleteMessage(id: number) {
  if (!confirm('Supprimer ce message ?')) return;
  try {
    await api.delete(`/notifications/messages/${id}`);
    messages.value = messages.value.filter(m => m.id !== id);
    emit('unread', unreadMessages.value);
    emit('toast', 'Message supprimé');
  } catch {
    emit('toast', 'Erreur suppression', 'toast-error');
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleString('fr-TN', { dateStyle: 'medium', timeStyle: 'short' });
}

function showLiveAlert(msg: string) {
  liveAlert.value = msg;
  setTimeout(() => { liveAlert.value = ''; }, 5000);
}

// Socket.io real-time
socket.on('newMessage', (msg: Message) => {
  messages.value.unshift(msg);
  showLiveAlert('Nouveau message reçu');
  emit('unread', unreadMessages.value);
});

onMounted(load);
onUnmounted(() => { socket.off('newMessage'); });
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────── */
.admin-page { max-width: 960px; margin: 0 auto; }

.page-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
}

.page-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem); font-weight: 300;
  color: #1a1c1c; line-height: 1; margin: 6px 0 0;
  letter-spacing: -0.01em;
}

.eyebrow {
  display: block; font-size: 9px; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: #735c00; margin: 0;
}

/* ── Pills ─────────────────────────────────────────── */
.header-pills { display: flex; gap: 4px; }

.pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  border: 1px solid rgba(115,92,0,.18);
  background: rgba(115,92,0,.08); color: #735c00;
  font-family: 'Manrope', sans-serif;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
}

.pill-badge {
  background: #735c00; color: #fff;
  font-size: 9px; font-weight: 800; padding: 2px 7px;
}

/* ── Live alert ─────────────────────────────────────── */
.live-alert {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px;
  background: rgba(115,92,0,.08); border: 1px solid rgba(115,92,0,.2);
  color: #735c00; font-weight: 700; margin-bottom: 20px;
  animation: feedbackIn 0.3s ease;
}

/* ── Notification list ──────────────────────────────── */
.notif-list { display: flex; flex-direction: column; gap: 8px; }

.notif-item {
  display: flex; align-items: flex-start; gap: 14px;
  background: #fff; padding: 18px 22px;
  box-shadow: 0 40px 60px -15px rgba(26,28,28,0.04);
  border-left: 4px solid transparent;
  transition: transform 0.2s;
}
.notif-item:hover { transform: translateX(3px); }
.notif-item.unread { border-left-color: #735c00; }

.notif-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 2px; color: #4d4635; }
.notif-body { flex: 1; }
.notif-body p { color: #1a1c1c; margin: 0 0 6px; line-height: 1.5; }
.notif-body time { font-size: 0.78rem; color: #4d4635; }

.notif-actions { display: flex; flex-direction: column; gap: 4px; }

/* ── Buttons ─────────────────────────────────────────── */
.btn-icon {
  background: none; border: none; cursor: pointer;
  font-size: 1rem; padding: 4px;
  display: inline-flex; align-items: center;
  transition: transform 0.15s, color 0.15s; color: #4d4635;
}
.btn-icon:hover { transform: scale(1.12); color: #735c00; }
.btn-icon--danger:hover { color: #ba1a1a !important; }

/* ── States ──────────────────────────────────────────── */
.empty-state, .loading-state {
  display: flex; flex-direction: column; align-items: center;
  gap: 12px; padding: 72px 24px; color: #4d4635; text-align: center;
}
.empty-state p { margin: 0; }

.spin { animation: rotate 1s linear infinite; display: block; font-size: 32px; }
@keyframes rotate { to { transform: rotate(360deg); } }
@keyframes feedbackIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
