<template>
  <div class="admin-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <p class="eyebrow">Administration</p>
        <h1 class="page-title">Réservations</h1>
      </div>
      <div class="header-meta">
        <span class="meta-count" v-if="!loading">
          <span class="material-symbols-outlined">event</span>
          {{ reservations.length }} réservation{{ reservations.length !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>

    <!-- Status tabs -->
    <div class="status-tabs">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="['tab', { 'tab--active': activeTab === tab.value }]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span class="tab-badge" v-if="countByStatus(tab.value) > 0">
          {{ countByStatus(tab.value) }}
        </span>
      </button>
    </div>

    <!-- Layout: list + detail -->
    <div class="reservations-layout">

      <!-- ── LEFT: List ── -->
      <div class="res-list-col">
        <div v-if="loading" class="loading-state">
          <span class="material-symbols-outlined spin">autorenew</span>
          Chargement…
        </div>

        <div v-else-if="filteredReservations.length === 0" class="empty-state">
          <span class="material-symbols-outlined" style="font-size:48px; color:#d0c5af;">event_busy</span>
          <p>Aucune réservation pour ce statut.</p>
        </div>

        <div v-else class="res-list">
          <div
            v-for="r in filteredReservations"
            :key="r.id"
            :class="['res-item', { 'res-item--active': selected?.id === r.id }]"
            @click="selected = r"
          >
            <div class="res-item-top">
              <span class="res-name">{{ r.name }}</span>
              <span :class="['res-status', statusClass(r.status)]">{{ statusLabel(r.status) }}</span>
            </div>
            <div class="res-item-sub">
              <span class="material-symbols-outlined" style="font-size:14px;">spa</span>
              {{ r.service }}
              <span v-if="r.eventType" class="event-type-chip">{{ r.eventType }}</span>
            </div>
            <div class="res-item-date">
              <span class="material-symbols-outlined" style="font-size:14px;">calendar_today</span>
              {{ r.preferredDate ? formatDate(r.preferredDate) : 'Date flexible' }}
            </div>
          </div>
        </div>
      </div>

      <!-- ── RIGHT: Detail Panel ── -->
      <div class="res-detail-col">
        <!-- Empty selection -->
        <div v-if="!selected" class="detail-placeholder">
          <span class="material-symbols-outlined" style="font-size:64px; color:#d0c5af;">touch_app</span>
          <p>Sélectionnez une réservation pour voir ses détails</p>
        </div>

        <!-- Detail card -->
        <div v-else class="detail-card">

          <!-- Card header -->
          <div class="detail-header">
            <div>
              <p class="detail-eyebrow">Réservation #{{ selected.id }}</p>
              <h2 class="detail-title">{{ selected.name }}</h2>
            </div>
            <button class="btn-icon" @click="selected = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Info grid -->
          <div class="detail-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">
                  <span class="material-symbols-outlined">mail</span> Email
                </span>
                <a :href="'mailto:' + selected.email" class="info-value info-value--link">
                  {{ selected.email }}
                </a>
              </div>
              <div class="info-item" v-if="selected.phone">
                <span class="info-label">
                  <span class="material-symbols-outlined">call</span> Téléphone
                </span>
                <a :href="'tel:' + selected.phone" class="info-value info-value--link">
                  {{ selected.phone }}
                </a>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <span class="material-symbols-outlined">spa</span> Service
                </span>
                <span class="info-value">{{ selected.service }}</span>
              </div>
              <div class="info-item" v-if="selected.eventType">
                <span class="info-label">
                  <span class="material-symbols-outlined">celebration</span> Type d'événement
                </span>
                <span class="info-value">{{ selected.eventType }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <span class="material-symbols-outlined">calendar_today</span> Date souhaitée
                </span>
                <span class="info-value">
                  {{ selected.preferredDate ? formatDate(selected.preferredDate) : 'Non précisée' }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <span class="material-symbols-outlined">schedule</span> Reçue le
                </span>
                <span class="info-value">{{ formatDate(selected.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <span class="material-symbols-outlined">flag</span> Statut
                </span>
                <span :class="['info-badge', statusClass(selected.status)]">
                  {{ statusLabel(selected.status) }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div class="notes-section" v-if="selected.notes">
              <p class="info-label">
                <span class="material-symbols-outlined">sticky_note_2</span> Notes du client
              </p>
              <div class="notes-box">{{ selected.notes }}</div>
            </div>
          </div>

          <!-- Actions -->
          <div class="detail-actions">
            <div class="status-actions">
              <p class="action-label">Changer le statut :</p>
              <div class="status-buttons">
                <button
                  v-for="s in statusOptions"
                  :key="s.value"
                  :class="['status-btn', statusClass(s.value), { 'status-btn--active': selected.status === s.value }]"
                  :disabled="saving"
                  @click="updateStatus(selected.id, s.value)"
                >
                  <span class="material-symbols-outlined" style="font-size:15px;">{{ s.icon }}</span>
                  {{ s.label }}
                </button>
              </div>
            </div>

            <div class="danger-actions">
              <button class="btn-delete" :disabled="saving" @click="deleteReservation(selected.id)">
                <span class="material-symbols-outlined" style="font-size:16px;">delete</span>
                Supprimer
              </button>
              <a
                :href="'mailto:' + selected.email + '?subject=Votre réservation - ' + selected.service"
                class="btn-contact"
              >
                <span class="material-symbols-outlined" style="font-size:16px;">mail</span>
                Contacter
              </a>
            </div>
          </div>

          <!-- Feedback -->
          <div v-if="feedback" :class="['feedback-bar', feedback.type]">
            {{ feedback.msg }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../../plugins/api';

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone?: string;
  service: string;
  eventType?: string;
  preferredDate?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const reservations = ref<Reservation[]>([]);
const loading      = ref(false);
const saving       = ref(false);
const selected     = ref<Reservation | null>(null);
const activeTab    = ref('ALL');
const feedback     = ref<{ msg: string; type: string } | null>(null);

// Status options match InquiryStatus enum in the real schema
const statusTabs = [
  { label: 'Toutes',     value: 'ALL'       },
  { label: 'Nouvelles',  value: 'NEW'       },
  { label: 'Contactées', value: 'CONTACTED' },
  { label: 'Confirmées', value: 'CONFIRMED' },
  { label: 'Terminées',  value: 'COMPLETED' },
  { label: 'Archivées',  value: 'ARCHIVED'  },
];

const statusOptions = [
  { value: 'NEW',       label: 'Nouvelle',  icon: 'fiber_new'     },
  { value: 'CONTACTED', label: 'Contactée', icon: 'phone_in_talk' },
  { value: 'CONFIRMED', label: 'Confirmée', icon: 'check_circle'  },
  { value: 'COMPLETED', label: 'Terminée',  icon: 'task_alt'      },
  { value: 'ARCHIVED',  label: 'Archivée',  icon: 'archive'       },
];

const filteredReservations = computed(() => {
  if (activeTab.value === 'ALL') return reservations.value;
  return reservations.value.filter(r => r.status === activeTab.value);
});

function countByStatus(tab: string) {
  if (tab === 'ALL') return reservations.value.length;
  return reservations.value.filter(r => r.status === tab).length;
}

function statusLabel(status: string) {
  return statusOptions.find(s => s.value === status)?.label ?? status;
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    NEW:       'status--new',
    CONTACTED: 'status--contacted',
    CONFIRMED: 'status--confirmed',
    COMPLETED: 'status--completed',
    ARCHIVED:  'status--archived',
  };
  return map[status] ?? 'status--new';
}

function formatDate(val: string) {
  return new Date(val).toLocaleDateString('fr-TN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

async function load() {
  loading.value = true;
  try {
    const res = await api.get('/reservations');
    reservations.value = res.data;
  } catch {
    reservations.value = [];
  } finally {
    loading.value = false;
  }
}

async function updateStatus(id: number, status: string) {
  saving.value = true;
  try {
    const res = await api.patch(`/reservations/${id}/status`, { status });
    const idx = reservations.value.findIndex(r => r.id === id);
    if (idx !== -1) reservations.value[idx] = res.data;
    if (selected.value?.id === id) selected.value = res.data;
    showFeedback('Statut mis à jour ✓', 'feedback--success');
  } catch {
    showFeedback('Erreur lors de la mise à jour', 'feedback--error');
  } finally {
    saving.value = false;
  }
}

async function deleteReservation(id: number) {
  if (!confirm('Supprimer cette réservation définitivement ?')) return;
  saving.value = true;
  try {
    await api.delete(`/reservations/${id}`);
    reservations.value = reservations.value.filter(r => r.id !== id);
    selected.value = null;
    showFeedback('Réservation supprimée', 'feedback--success');
  } catch {
    showFeedback('Erreur lors de la suppression', 'feedback--error');
  } finally {
    saving.value = false;
  }
}

function showFeedback(msg: string, type: string) {
  feedback.value = { msg, type };
  setTimeout(() => { feedback.value = null; }, 3000);
}

onMounted(load);
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────── */
.admin-page { max-width: 1300px; margin: 0 auto; }

.page-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
}

.page-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 4vw, 3rem); font-weight: 300;
  color: #1a1c1c; line-height: 1; margin: 6px 0 0; letter-spacing: -0.01em;
}

.eyebrow {
  display: block; font-size: 9px; font-weight: 700;
  letter-spacing: 0.22em; text-transform: uppercase; color: #735c00; margin: 0;
}

.header-meta { display: flex; align-items: center; }
.meta-count {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #4d4635;
}

/* ── Tabs ─────────────────────────────────────────── */
.status-tabs {
  display: flex; gap: 0; flex-wrap: wrap;
  margin-bottom: 24px; border-bottom: 1px solid rgba(115,92,0,.1);
}

.tab {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border: none; background: transparent; color: #4d4635;
  font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
  border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.18s;
}
.tab:hover { color: #735c00; }
.tab--active { color: #735c00; border-bottom-color: #735c00; }

.tab-badge {
  background: #735c00; color: #fff; font-size: 9px; font-weight: 800;
  padding: 2px 6px; min-width: 18px; text-align: center;
}

/* ── Layout ───────────────────────────────────────── */
.reservations-layout {
  display: grid; grid-template-columns: 360px 1fr; gap: 24px; align-items: start;
}

/* ── List column ──────────────────────────────────── */
.res-list-col { background: #fff; box-shadow: 0 40px 60px -15px rgba(26,28,28,0.05); }
.res-list { display: flex; flex-direction: column; }

.res-item {
  padding: 16px 20px; border-bottom: 1px solid rgba(115,92,0,.06);
  cursor: pointer; transition: background 0.15s; border-left: 3px solid transparent;
}
.res-item:last-child { border-bottom: none; }
.res-item:hover { background: rgba(115,92,0,.03); }
.res-item--active { background: rgba(115,92,0,.06) !important; border-left-color: #735c00; }

.res-item-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 8px; margin-bottom: 6px;
}
.res-name { font-weight: 700; color: #1a1c1c; font-size: 0.9rem; }

.res-item-sub, .res-item-date {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.8rem; color: #4d4635; margin-top: 4px;
}

.event-type-chip {
  background: rgba(115,92,0,.08); color: #735c00;
  font-size: 8px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; padding: 2px 6px; margin-left: 4px;
}

/* ── Detail column ────────────────────────────────── */
.res-detail-col { position: sticky; top: 24px; }

.detail-placeholder {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 16px; padding: 80px 24px; color: #4d4635;
  text-align: center; background: #fff; box-shadow: 0 40px 60px -15px rgba(26,28,28,0.05);
}
.detail-placeholder p { margin: 0; font-size: 0.9rem; }

.detail-card { background: #fff; box-shadow: 0 40px 60px -15px rgba(26,28,28,0.05); }

.detail-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 28px 32px 20px; border-bottom: 1px solid rgba(115,92,0,.08);
}
.detail-eyebrow {
  font-size: 9px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
  color: #735c00; margin: 0 0 6px;
}
.detail-title {
  font-family: 'Newsreader', Georgia, serif; font-size: 2rem;
  font-weight: 300; color: #1a1c1c; margin: 0;
}

.detail-body { padding: 28px 32px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
.info-item { display: flex; flex-direction: column; gap: 6px; }
.info-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: #4d4635;
}
.info-value { font-size: 0.9rem; color: #1a1c1c; font-weight: 600; }
.info-value--link { color: #735c00; text-decoration: none; }
.info-value--link:hover { text-decoration: underline; }

/* Status badges */
.info-badge, .res-status {
  display: inline-flex; align-items: center; padding: 3px 10px;
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
}
.status--new       { background: rgba(115,92,0,.1);       color: #735c00; }
.status--contacted { background: rgba(100,149,237,.1);    color: #3a6cc7; }
.status--confirmed { background: rgba(34,160,80,.1);      color: #22a050; }
.status--completed { background: rgba(77,70,53,.1);       color: #4d4635; }
.status--archived  { background: rgba(120,120,120,.1);    color: #666;    }

/* Notes */
.notes-section { margin-top: 4px; }
.notes-box {
  margin-top: 8px; padding: 16px; background: #f3f3f4;
  font-size: 0.875rem; color: #1a1c1c; line-height: 1.7; white-space: pre-wrap;
}

/* Actions */
.detail-actions {
  padding: 20px 32px 28px; border-top: 1px solid rgba(115,92,0,.08);
  display: flex; flex-direction: column; gap: 20px;
}
.action-label {
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: #4d4635; margin: 0 0 10px;
}
.status-buttons { display: flex; flex-wrap: wrap; gap: 8px; }

.status-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
  border: 1px solid transparent; background: #f3f3f4; color: #4d4635;
  font-family: 'Manrope', sans-serif; font-size: 9px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.18s;
}
.status-btn:hover { border-color: currentColor; background: transparent; }
.status-btn--active { background: #735c00 !important; color: #fff !important; border-color: #735c00 !important; }
.status-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.danger-actions { display: flex; gap: 10px; flex-wrap: wrap; }

.btn-delete {
  display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 18px;
  border: 1px solid rgba(186,26,26,.3); background: transparent; color: #ba1a1a;
  font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.18s;
}
.btn-delete:hover { background: rgba(186,26,26,.06); }

.btn-contact {
  display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 18px;
  background: #735c00; color: #fff; font-family: 'Manrope', sans-serif;
  font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
  text-decoration: none; transition: background 0.18s;
}
.btn-contact:hover { background: #574500; }

/* Feedback */
.feedback-bar {
  margin: 0 32px 24px; padding: 12px 18px;
  font-size: 0.875rem; font-weight: 700; animation: fadeUp 0.25s ease;
}
.feedback--success { background: rgba(34,160,80,.1); color: #22a050; }
.feedback--error   { background: rgba(186,26,26,.08); color: #ba1a1a; }

/* Utilities */
.btn-icon {
  background: none; border: none; cursor: pointer; padding: 6px; color: #4d4635;
  display: inline-flex; align-items: center; transition: color 0.15s;
}
.btn-icon:hover { color: #735c00; }

.loading-state, .empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px; padding: 60px 24px; color: #4d4635; text-align: center;
}
.empty-state p { margin: 0; font-size: 0.9rem; }
.spin { animation: rotate 1s linear infinite; display: block; font-size: 32px; }

@keyframes rotate { to { transform: rotate(360deg); } }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .reservations-layout { grid-template-columns: 1fr; }
  .res-detail-col { position: static; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>
