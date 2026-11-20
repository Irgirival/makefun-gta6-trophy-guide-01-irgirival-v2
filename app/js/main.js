// Boot: load the trophy data, wire the toolbar, tabs, hash routing and save
// actions, then render. The app fetches only its own data/trophies.json and
// nothing else: it works with the network off once served from its own files.
import {
  STORE_KEY,
  demoProgress,
  earnedCount,
  emptyProgress,
  exportProgress,
  loadProgress,
  parseImportedProgress,
  saveProgress,
} from './store.js';
import { applyFilters, countsByGrade, countsByKind, countsByStage } from './filters.js';
import { renderMissables, renderRoadmap } from './roadmap.js';
import { renderChecklist, renderDetail, renderStats } from './views.js';

const state = {
  tab: 'guide',
  search: '',
  kind: 'all',
  grade: 'all',
  sort: 'default',
  missableOnly: false,
  hideEarned: false,
  spoilerSafe: true,
  selectedId: null,
  progress: loadProgress(),
};

let trophies = [];
let trophyByName = new Map();

const $ = (id) => document.getElementById(id);

function updateProgressHeader() {
  const earned = earnedCount(state.progress);
  $('earnedCount').textContent = String(earned);
  $('progressFill').style.width = `${Math.round((earned / trophies.length) * 100)}%`;
  const byGrade = countsByGrade(trophies, state.progress);
  const chips = $('gradeChips');
  chips.replaceChildren();
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    const dot = document.createElement('span');
    dot.className = `dot ${g}`;
    chip.append(dot);
    chip.append(document.createTextNode(`${g}: ${byGrade[g]?.earned || 0}/${byGrade[g]?.total || 0}`));
    chips.append(chip);
  }
}

function renderAll() {
  updateProgressHeader();
  if (state.tab === 'guide') {
    const list = applyFilters(trophies, state.progress, state);
    $('resultLine').textContent = `Showing ${list.length} of ${trophies.length} trophies \u00b7 ${earnedCount(state.progress)} earned`;
    renderChecklist($('checklist'), list, state.progress, state, (name) => {
      state.selectedId = name;
      location.hash = `#/guide/${encodeURIComponent(name)}`;
      renderAll();
    });
    const selected = trophyByName.get(state.selectedId) || null;
    renderDetail($('detail'), selected, state.progress, state);
  } else if (state.tab === 'roadmap') {
    renderRoadmap($('roadmap'), trophies, state.progress, state.spoilerSafe);
  } else if (state.tab === 'missables') {
    renderMissables($('missables'), trophies);
  } else if (state.tab === 'stats') {
    renderStats(
      $('stats'),
      trophies,
      state.progress,
      countsByGrade(trophies, state.progress),
      countsByKind(trophies, state.progress),
      countsByStage(trophies, state.progress),
    );
  }
}

state.onProgressChange = () => {
  saveProgress(state.progress);
  renderAll();
};

function showTab(tab) {
  state.tab = tab;
  for (const btn of document.querySelectorAll('#tabs .tab')) {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  }
  for (const view of document.querySelectorAll('main .view')) {
    view.hidden = view.id !== `view-${tab}`;
  }
  renderAll();
}

function readHash() {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const tab = parts[0] || 'guide';
  state.tab = ['guide', 'roadmap', 'missables', 'stats'].includes(tab) ? tab : 'guide';
  state.selectedId = state.tab === 'guide' && parts[1] ? decodeURIComponent(parts[1]) : state.selectedId;
  if (state.selectedId && !trophyByName.has(state.selectedId)) state.selectedId = null;
  showTab(state.tab);
}

async function boot() {
  const res = await fetch('data/trophies.json');
  const doc = await res.json();
  trophies = doc.trophies;
  trophyByName = new Map(trophies.map((t) => [t.name, t]));

  // ?demo=1 seeds sample progress once, for screenshots and for readers who
  // want to see the tracker filled in. The "Load demo progress" button does
  // the same thing on demand.
  const params = new URLSearchParams(location.search);
  if (params.get('demo') === '1' && earnedCount(state.progress) === 0) {
    state.progress = demoProgress();
    saveProgress(state.progress);
  }

  $('search').addEventListener('input', (e) => {
    state.search = e.target.value;
    renderAll();
  });
  $('kindFilter').addEventListener('change', (e) => {
    state.kind = e.target.value;
    renderAll();
  });
  $('gradeFilter').addEventListener('change', (e) => {
    state.grade = e.target.value;
    renderAll();
  });
  $('sortFilter').addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderAll();
  });
  $('missableOnly').addEventListener('change', (e) => {
    state.missableOnly = e.target.checked;
    renderAll();
  });
  $('hideEarned').addEventListener('change', (e) => {
    state.hideEarned = e.target.checked;
    renderAll();
  });
  $('spoilerSafe').addEventListener('change', (e) => {
    state.spoilerSafe = e.target.checked;
    renderAll();
  });
  for (const btn of document.querySelectorAll('#tabs .tab')) {
    btn.addEventListener('click', () => {
      location.hash = `#/${btn.dataset.tab}`;
    });
  }
  $('exportBtn').addEventListener('click', () => {
    exportProgress(state.progress);
    $('saveNote').textContent = 'Exported gta6-trophy-progress.json.';
  });
  $('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state.progress = parseImportedProgress(await file.text());
      saveProgress(state.progress);
      $('saveNote').textContent = `Imported ${file.name}: ${earnedCount(state.progress)} trophies earned.`;
    } catch {
      $('saveNote').textContent = 'That file is not a trophy-progress export.';
    }
    e.target.value = '';
    renderAll();
  });
  $('demoBtn').addEventListener('click', () => {
    state.progress = demoProgress();
    saveProgress(state.progress);
    $('saveNote').textContent = 'Demo progress loaded: 13 of 55 earned, several counters part way.';
    renderAll();
  });
  $('resetBtn').addEventListener('click', () => {
    if (window.confirm('Reset all progress? This clears every earned trophy and counter.')) {
      state.progress = emptyProgress();
      saveProgress(state.progress);
      $('saveNote').textContent = 'Progress reset.';
      renderAll();
    }
  });
  window.addEventListener('hashchange', readHash);
  readHash();
  void STORE_KEY;
}

boot();
