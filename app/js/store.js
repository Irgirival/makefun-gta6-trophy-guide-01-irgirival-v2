// Progress store: earned trophies and per-trophy counters, saved in localStorage.
// Export/import is plain JSON so progress moves between browsers.
export const STORE_KEY = 'gta6-trophy-guide-v2';

export function emptyProgress() {
  return { version: 2, earned: {}, counts: {} };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyProgress();
    return {
      version: 2,
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function isEarned(progress, name) {
  return Boolean(progress.earned[name]);
}

export function toggleEarned(progress, name) {
  if (progress.earned[name]) delete progress.earned[name];
  else progress.earned[name] = true;
  saveProgress(progress);
  return progress;
}

export function earnedCount(progress) {
  return Object.keys(progress.earned).length;
}

export function getCount(progress, name) {
  const n = Number(progress.counts[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function setCount(progress, name, value) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  if (n === 0) delete progress.counts[name];
  else progress.counts[name] = n;
  saveProgress(progress);
  return progress;
}

export function exportProgress(progress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseImportedProgress(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file.');
  return {
    version: 2,
    earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
    counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
  };
}

// Sample progress for the "Load demo progress" button and ?demo=1 screenshots:
// 13 trophies earned, several counters part way.
export function demoProgress() {
  return {
    version: 2,
    earned: {
      'Just Like Paradise': true,
      'Paradise Lost': true,
      'Trust': true,
      'Master of None': true,
      'Top Fun': true,
      'Baited My Tackle': true,
      'Stick Fiddler': true,
      'Strangers & Freaks': true,
      'Hot Together': true,
      'Gunslinger': true,
      'Sneakthief': true,
      'The Goodtime State': true,
      'Treat Yo Self': true,
    },
    counts: {
      'Cunning Stunts': 120,
      'The Shootist': 12,
      'Earn Cash, Not Kudos': 8,
      'One Last Thing': 22,
      'Whip It Good': 47,
      'You WAiNKer!': 34,
      'Dime on the Dollar': 85000,
    },
  };
}
