// Filtering, searching, sorting and the spoiler rule for the checklist.
// A hidden trophy stays masked while spoiler-safe mode is on and it is unearned:
// its name, description and guide are replaced with a placeholder until earned.
export const KIND_LABELS = {
  story: 'Story',
  collectible: 'Collectible',
  activity: 'Activity',
  crime: 'Crime',
  exploration: 'Exploration',
  money: 'Money',
  misc: 'Misc',
};

export const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };

export function isMasked(trophy, progress, spoilerSafe) {
  return spoilerSafe && trophy.hidden && !progress.earned[trophy.name];
}

export function displayName(trophy, progress, spoilerSafe) {
  return isMasked(trophy, progress, spoilerSafe) ? 'Hidden trophy' : trophy.name;
}

export function applyFilters(trophies, progress, state) {
  const q = state.search.trim().toLowerCase();
  let list = trophies.filter((t) => {
    if (state.kind !== 'all' && t.kind !== state.kind) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.missableOnly && !t.missable) return false;
    if (state.hideEarned && progress.earned[t.name]) return false;
    if (q) {
      const hay = `${t.name} ${t.description} ${t.guide} ${KIND_LABELS[t.kind] || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  switch (state.sort) {
    case 'name':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'grade':
      list = [...list].sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.name.localeCompare(b.name));
      break;
    case 'stage':
      list = [...list].sort((a, b) => a.stage - b.stage || a.id - b.id);
      break;
    case 'progress': {
      const score = (t) => {
        if (progress.earned[t.name]) return 2;
        if (t.target && (progress.counts[t.name] || 0) > 0) return 1;
        return 0;
      };
      list = [...list].sort((a, b) => score(b) - score(a) || a.id - b.id);
      break;
    }
    default:
      list = [...list].sort((a, b) => a.id - b.id);
  }
  return list;
}

export function countsByGrade(trophies, progress) {
  const out = {};
  for (const t of trophies) {
    out[t.grade] = out[t.grade] || { total: 0, earned: 0 };
    out[t.grade].total += 1;
    if (progress.earned[t.name]) out[t.grade].earned += 1;
  }
  return out;
}

export function countsByKind(trophies, progress) {
  const out = {};
  for (const t of trophies) {
    out[t.kind] = out[t.kind] || { total: 0, earned: 0 };
    out[t.kind].total += 1;
    if (progress.earned[t.name]) out[t.kind].earned += 1;
  }
  return out;
}

export function countsByStage(trophies, progress) {
  const out = {};
  for (const t of trophies) {
    out[t.stage] = out[t.stage] || { total: 0, earned: 0 };
    out[t.stage].total += 1;
    if (progress.earned[t.name]) out[t.stage].earned += 1;
  }
  return out;
}
