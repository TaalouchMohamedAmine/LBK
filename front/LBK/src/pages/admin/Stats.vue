<template>
  <div class="dash-page">

    <!-- ── Page hero ─────────────────────────────────── -->
    <section class="dash-hero">
      <div>
        <h2 class="dash-title">Tableau de Bord</h2>
        <p class="dash-subtitle">Bienvenue dans votre atelier de gestion numérique.</p>
      </div>
      <div class="dash-hero-right">
        <button class="ghost-btn" @click="load">
          <span class="material-symbols-outlined" style="font-size:16px;">refresh</span>
          Actualiser
        </button>
      </div>
    </section>

    <!-- Loading skeleton -->
    <div v-if="loading" class="loading-state">
      <span class="material-symbols-outlined spin">progress_activity</span>
      Chargement…
    </div>

    <template v-else>

      <!-- ── KPI Cards ───────────────────────────────── -->
      <section class="kpi-grid">
        <div
          v-for="(k, i) in kpiCards"
          :key="k.label"
          class="kpi-card"
          :class="i === 0 ? 'kpi-card--accent' : ''"
        >
          <p class="kpi-label">{{ k.label }}</p>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ k.value }}</span>
            <span class="kpi-trend" :class="k.trendClass">{{ k.trend }}</span>
          </div>
        </div>
      </section>

      <!-- ── Analytics Section ────────────────────────── -->
      <section class="analytics-grid">

        <!-- Sales Area Chart -->
        <div class="chart-card">
          <div class="chart-card-header">
            <h4 class="chart-card-title">Statistiques de Vente</h4>
            <div class="chart-legend">
              <span class="legend-dot"></span>
              <span class="legend-label">Revenus {{ currentYear }}</span>
            </div>
          </div>
          <apexchart
            type="area"
            height="300"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Quick Stats Panel -->
        <div class="stats-panel">
          <h4 class="chart-card-title" style="margin-bottom: 24px;">Vue d'ensemble</h4>

          <div class="stat-row" v-for="s in quickStats" :key="s.label">
            <div class="stat-row-icon">
              <span class="material-symbols-outlined">{{ s.icon }}</span>
            </div>
            <div class="stat-row-body">
              <p class="stat-row-label">{{ s.label }}</p>
              <p class="stat-row-value">{{ s.value }}</p>
            </div>
            <div class="stat-row-bar-wrap">
              <div class="stat-row-bar" :style="{ width: s.pct + '%' }"></div>
            </div>
          </div>

          <button class="view-all-btn" @click="$router.push('/admin/notifications')">
            Voir toutes les notifications
          </button>
        </div>

      </section>

      <!-- ── Radial Stats Row ─────────────────────────── -->
      <section class="radial-row">
        <div class="radial-card" v-for="r in radialStats" :key="r.label">
          <apexchart
            type="radialBar"
            height="160"
            :options="radialOptions(r)"
            :series="[r.pct]"
          />
          <p class="radial-label">{{ r.label }}</p>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../../plugins/api';

const emit = defineEmits(['toast']);

const stats   = ref<any>(null);
const loading = ref(false);
const currentYear = new Date().getFullYear();

/* ── KPI cards ─────────────────────────────────────────── */
const kpiCards = computed(() => [
  {
    label: 'Produits Actifs',
    value: stats.value?.productCount ?? 0,
    trend: 'Stable',
    trendClass: 'trend-neutral',
  },
  {
    label: 'Catégories',
    value: stats.value?.categoryCount ?? 0,
    trend: '+ actif',
    trendClass: 'trend-up',
  },
  {
    label: 'Réservations',
    value: stats.value?.reservationCount ?? 0,
    trend: '+5%',
    trendClass: 'trend-up',
  },
  {
    label: 'Messages',
    value: stats.value?.messageCount ?? 0,
    trend: 'Nouveaux',
    trendClass: 'trend-up',
  },
]);

/* ── Quick stats list ──────────────────────────────────── */
const quickStats = computed(() => {
  const p = stats.value?.productCount    ?? 0;
  const c = stats.value?.categoryCount   ?? 0;
  const r = stats.value?.reservationCount ?? 0;
  const m = stats.value?.messageCount    ?? 0;
  const max = Math.max(p, c, r, m, 1);
  return [
    { icon: 'inventory_2',   label: 'Produits',      value: p, pct: Math.round(p / max * 100) },
    { icon: 'category',      label: 'Catégories',    value: c, pct: Math.round(c / max * 100) },
    { icon: 'calendar_today',label: 'Réservations',  value: r, pct: Math.round(r / max * 100) },
    { icon: 'mail',          label: 'Messages',      value: m, pct: Math.round(m / max * 100) },
  ];
});

/* ── Radial stats ──────────────────────────────────────── */
const radialStats = computed(() => {
  const p = stats.value?.productCount    ?? 0;
  const r = stats.value?.reservationCount ?? 0;
  const m = stats.value?.messageCount    ?? 0;
  const max = Math.max(p, r, m, 1);
  return [
    { label: 'Produits',     pct: Math.min(Math.round(p / max * 100), 100) },
    { label: 'Réservations', pct: Math.min(Math.round(r / max * 100), 100) },
    { label: 'Messages',     pct: Math.min(Math.round(m / max * 100), 100) },
  ];
});

/* ── ApexCharts – Area chart ───────────────────────────── */
const chartSeries = computed(() => [{
  name: 'Ventes Mensuelles',
  data: [
    stats.value?.productCount   ?? 0,
    stats.value?.categoryCount  ?? 0,
    stats.value?.reservationCount ?? 0,
    stats.value?.messageCount   ?? 0,
    stats.value?.productCount   ?? 0,
    stats.value?.reservationCount ?? 0,
    stats.value?.messageCount   ?? 0,
  ],
}]);

const chartOptions = {
  chart: {
    type: 'area',
    toolbar: { show: false },
    fontFamily: 'Manrope, sans-serif',
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 600,
    },
  },
  colors: ['#735c00'],
  dataLabels: { enabled: false },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.03,
      stops: [0, 100],
    },
  },
  grid: {
    borderColor: '#eeeeee',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  xaxis: {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    labels: {
      style: { colors: '#4d4635', fontSize: '10px', fontFamily: 'Manrope, sans-serif' },
    },
    axisBorder: { show: false },
    axisTicks:  { show: false },
  },
  yaxis: {
    labels: {
      formatter: (v: number) => v.toString(),
      style: { colors: '#4d4635', fontSize: '10px', fontFamily: 'Manrope, sans-serif' },
    },
  },
  tooltip: {
    theme: 'light',
    x: { show: false },
    style: { fontFamily: 'Manrope, sans-serif' },
  },
};

/* ── ApexCharts – Radial chart ─────────────────────────── */
function radialOptions(r: { label: string; pct: number }) {
  return {
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '55%' },
        dataLabels: {
          value: {
            fontSize: '18px',
            fontFamily: 'Newsreader, Georgia, serif',
            color: '#735c00',
            offsetY: 4,
          },
          name: { show: false },
        },
        track: { background: '#eeeeee' },
      },
    },
    colors: ['#735c00'],
    stroke: { lineCap: 'butt' },
  };
}

/* ── Data load ─────────────────────────────────────────── */
async function load() {
  loading.value = true;
  try {
    const { data } = await api.get('/stats');
    stats.value = data;
  } catch {
    emit('toast', 'Erreur chargement stats', 'toast-error');
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<style scoped>

/* ── Page ────────────────────────────────────────────── */
.dash-page {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ── Hero ─────────────────────────────────────────────── */
.dash-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.dash-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 300;
  color: #1a1c1c;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1;
}

.dash-subtitle {
  font-size: 0.9rem;
  color: #4d4635;
  font-style: italic;
  margin: 8px 0 0;
}

.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 1px solid rgba(115, 92, 0, 0.2);
  background: transparent;
  color: #4d4635;
  font-family: 'Manrope', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.ghost-btn:hover {
  background: rgba(115, 92, 0, 0.06);
  color: #735c00;
}

/* ── KPI Grid ─────────────────────────────────────────── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.kpi-card {
  background: #fff;
  padding: 32px 28px;
  border-left: 4px solid rgba(208, 197, 175, 0.6);
  box-shadow: 0 40px 60px -15px rgba(26, 28, 28, 0.04);
  transition: transform 0.45s ease;
}
.kpi-card:hover {
  transform: translateY(-4px);
}
.kpi-card--accent {
  border-left-color: #735c00;
}

.kpi-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4d4635;
  margin: 0 0 10px;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.kpi-value {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 2.6rem;
  font-weight: 300;
  color: #1a1c1c;
  line-height: 1;
}

.kpi-trend {
  font-size: 11px;
  font-weight: 700;
}
.trend-up      { color: #735c00; }
.trend-neutral { color: rgba(77, 70, 53, 0.45); }
.trend-down    { color: #ba1a1a; }

/* ── Analytics Grid ───────────────────────────────────── */
.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

@media (max-width: 900px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card,
.stats-panel {
  background: #fff;
  padding: 36px;
  box-shadow: 0 40px 60px -15px rgba(26, 28, 28, 0.04);
}

.chart-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-card-title {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.6rem;
  font-weight: 300;
  color: #1a1c1c;
  margin: 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 8px;
}
.legend-dot {
  width: 12px;
  height: 12px;
  background: #735c00;
  flex-shrink: 0;
}
.legend-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4d4635;
}

/* Stats panel list */
.stat-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(208, 197, 175, 0.18);
  position: relative;
}
.stat-row:last-of-type {
  border-bottom: none;
}

.stat-row-icon {
  width: 36px;
  height: 36px;
  background: #f3f3f4;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #735c00;
}

.stat-row-body {
  flex: 1;
  min-width: 0;
}

.stat-row-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #4d4635;
  margin: 0 0 2px;
}

.stat-row-value {
  font-family: 'Newsreader', Georgia, serif;
  font-size: 1.4rem;
  font-weight: 300;
  color: #1a1c1c;
  margin: 0;
  line-height: 1;
}

.stat-row-bar-wrap {
  width: 60px;
  height: 3px;
  background: #eeeeee;
  flex-shrink: 0;
}
.stat-row-bar {
  height: 100%;
  background: #735c00;
  transition: width 0.5s ease;
}

.view-all-btn {
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  text-align: center;
  background: transparent;
  border: none;
  font-family: 'Manrope', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4d4635;
  cursor: pointer;
  transition: color 0.18s;
}
.view-all-btn:hover {
  color: #735c00;
}

/* ── Radial Row ───────────────────────────────────────── */
.radial-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 640px) {
  .radial-row {
    grid-template-columns: 1fr;
  }
}

.radial-card {
  background: #fff;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 40px 60px -15px rgba(26, 28, 28, 0.04);
  transition: transform 0.45s ease;
}
.radial-card:hover {
  transform: translateY(-3px);
}

.radial-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #4d4635;
  margin: 4px 0 0;
  text-align: center;
}

/* ── Loading ──────────────────────────────────────────── */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 24px;
  color: #4d4635;
  font-size: 0.9rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
