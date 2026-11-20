// Views: the checklist, the trophy detail pane, and the stats page.
// Every row shows the official name, description and grade, the kind and roadmap
// stage, the missable / hidden / unconfirmed flags, and the counter where the
// trophy tracks one. The detail pane shows the guide in this entry's own words
// with its sources beside it.
import { getCount, isEarned, setCount, toggleEarned } from './store.js';
import { KIND_LABELS, displayName, isMasked } from './filters.js';

export function formatTarget(trophy) {
  if (!trophy.target) return null;
  if (trophy.target >= 1000) return trophy.target.toLocaleString('en-US');
  return String(trophy.target);
}

export function renderChecklist(container, list, progress, state, onSelect) {
  container.replaceChildren();
  if (list.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'No trophies match those filters. Clear the search or widen the filters.';
    container.append(p);
    return;
  }
  for (const t of list) {
    const masked = isMasked(t, progress, state.spoilerSafe);
    const earned = isEarned(progress, t.name);
    const row = document.createElement('div');
    row.className = `trophy-row${earned ? ' earned' : ''}${state.selectedId === t.name ? ' selected' : ''}`;
    row.setAttribute('role', 'button');
    row.tabIndex = 0;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${masked ? 'hidden trophy' : t.name} earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      toggleEarned(progress, t.name);
      state.onProgressChange();
    });
    row.append(box);
    const dot = document.createElement('span');
    dot.className = `dot ${t.grade}`;
    row.append(dot);
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(t, progress, state.spoilerSafe);
    body.append(name);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = masked ? 'Hidden on PlayStation until earned. Spoiler-safe mode is on.' : t.description;
    body.append(desc);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const grade = document.createElement('span');
    grade.className = `grade-tag ${t.grade}`;
    grade.textContent = t.grade;
    meta.append(grade);
    const kind = document.createElement('span');
    kind.className = 'flag kind';
    kind.textContent = KIND_LABELS[t.kind] || t.kind;
    meta.append(kind);
    const stage = document.createElement('span');
    stage.className = 'flag stage';
    stage.textContent = `Stage ${t.stage}`;
    meta.append(stage);
    if (t.missable) {
      const f = document.createElement('span');
      f.className = 'flag missable';
      f.textContent = 'Missable';
      meta.append(f);
    }
    if (t.hidden) {
      const f = document.createElement('span');
      f.className = 'flag hidden';
      f.textContent = 'Hidden';
      meta.append(f);
    }
    if (t.unconfirmed) {
      const f = document.createElement('span');
      f.className = 'flag unconfirmed';
      f.textContent = 'Unconfirmed';
      meta.append(f);
    }
    body.append(meta);
    if (t.target) {
      const c = document.createElement('div');
      c.className = 'counter';
      const n = getCount(progress, t.name);
      c.innerHTML = '';
      const b = document.createElement('b');
      b.textContent = `${n.toLocaleString('en-US')} / ${formatTarget(t)}`;
      c.append(b);
      const note = document.createElement('span');
      note.textContent = t.targetNote ? ` ${t.targetNote}` : '';
      c.append(note);
      body.append(c);
    }
    row.append(body);
    const open = document.createElement('span');
    open.textContent = '\u203a';
    open.setAttribute('aria-hidden', 'true');
    row.append(open);
    row.addEventListener('click', () => onSelect(t.name));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(t.name);
      }
    });
    container.append(row);
  }
}

export function renderDetail(container, trophy, progress, state) {
  container.replaceChildren();
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'empty';
    p.textContent = 'Pick a trophy on the left to read its guide, sources and progress.';
    container.append(p);
    return;
  }
  const masked = isMasked(trophy, progress, state.spoilerSafe);
  const earned = isEarned(progress, trophy.name);
  const h = document.createElement('h3');
  h.textContent = masked ? 'Hidden trophy' : trophy.name;
  container.append(h);
  const meta = document.createElement('p');
  meta.className = 'official';
  meta.textContent = masked
    ? 'Hidden on PlayStation until earned. Turn spoiler-safe mode off, or earn it, to reveal the name, description and guide.'
    : `${trophy.description} \u00b7 ${trophy.grade} \u00b7 ${KIND_LABELS[trophy.kind] || trophy.kind} \u00b7 Roadmap stage ${trophy.stage}`;
  container.append(meta);
  if (trophy.missable) {
    const flag = document.createElement('p');
    flag.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = '\u26a0 Possibly missable: ';
    flag.append(b);
    flag.append(document.createTextNode('do the Chapter 1 balcony meditation before the chapter ends. See the Missables tab.'));
    container.append(flag);
  }
  if (trophy.unconfirmed && !masked) {
    const flag = document.createElement('p');
    const b = document.createElement('b');
    b.textContent = 'Unconfirmed: ';
    flag.append(b);
    flag.append(document.createTextNode('no guide has pinned down the exact trigger yet.'));
    container.append(flag);
  }
  if (!masked) {
    const guide = document.createElement('div');
    guide.className = 'guide-text';
    const p = document.createElement('p');
    p.textContent = trophy.guide;
    guide.append(p);
    container.append(guide);
    if (trophy.target) {
      const stepper = document.createElement('div');
      stepper.className = 'stepper';
      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '\u2212';
      minus.setAttribute('aria-label', 'Decrease count');
      const readout = document.createElement('span');
      readout.className = 'count-readout';
      const updateReadout = () => {
        readout.replaceChildren();
        const b = document.createElement('b');
        b.textContent = `${getCount(progress, trophy.name).toLocaleString('en-US')} / ${formatTarget(trophy)}`;
        readout.append(b);
        const note = document.createElement('span');
        note.textContent = trophy.targetNote ? ` ${trophy.targetNote}` : '';
        readout.append(note);
      };
      updateReadout();
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.setAttribute('aria-label', 'Increase count');
      minus.addEventListener('click', () => {
        setCount(progress, trophy.name, getCount(progress, trophy.name) - 1);
        updateReadout();
        state.onProgressChange();
      });
      plus.addEventListener('click', () => {
        setCount(progress, trophy.name, getCount(progress, trophy.name) + 1);
        updateReadout();
        state.onProgressChange();
      });
      stepper.append(minus, readout, plus);
      container.append(stepper);
    }
    const sources = document.createElement('p');
    sources.className = 'sources-line';
    const label = document.createElement('b');
    label.textContent = 'Sources: ';
    sources.append(label);
    (trophy.sources || []).forEach((s, i) => {
      if (i > 0) sources.append(document.createTextNode(' \u00b7 '));
      if (s.url) {
        const a = document.createElement('a');
        a.href = s.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = s.label;
        sources.append(a);
      } else {
        sources.append(document.createTextNode(s.label));
      }
    });
    container.append(sources);
  }
  const earn = document.createElement('button');
  earn.type = 'button';
  earn.className = `earn-btn${earned ? ' earned' : ''}`;
  earn.textContent = earned ? '\u2713 Earned \u2014 tap to unmark' : 'Mark as earned';
  earn.addEventListener('click', () => {
    toggleEarned(progress, trophy.name);
    state.onProgressChange();
  });
  container.append(earn);
}

export function renderStats(container, trophies, progress, byGrade, byKind, byStage) {
  container.replaceChildren();
  const grid = document.createElement('div');
  grid.className = 'stats-grid';
  const mkCard = (title, rows) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    const h = document.createElement('h3');
    h.textContent = title;
    card.append(h);
    for (const [label, got, total] of rows) {
      const row = document.createElement('div');
      row.className = 'stat-row';
      const name = document.createElement('span');
      name.textContent = label;
      const bar = document.createElement('span');
      bar.className = 'bar';
      const fill = document.createElement('div');
      fill.style.width = total ? `${Math.round((got / total) * 100)}%` : '0%';
      bar.append(fill);
      const num = document.createElement('span');
      num.textContent = `${got}/${total}`;
      row.append(name, bar, num);
      card.append(row);
    }
    return card;
  };
  grid.append(
    mkCard(
      'By grade',
      ['platinum', 'gold', 'silver', 'bronze'].map((g) => [
        g[0].toUpperCase() + g.slice(1),
        byGrade[g]?.earned || 0,
        byGrade[g]?.total || 0,
      ]),
    ),
    mkCard(
      'By kind',
      Object.entries(byKind).map(([k, v]) => [KIND_LABELS[k] || k, v.earned, v.total]),
    ),
    mkCard(
      'By roadmap stage',
      [1, 2, 3, 4, 5].map((s) => [
        `Stage ${s}`,
        byStage[s]?.earned || 0,
        byStage[s]?.total || 0,
      ]),
    ),
  );
  const counters = trophies.filter((t) => t.target);
  const doneCounters = counters.filter((t) => getCount(progress, t.name) >= t.target).length;
  const counterCard = document.createElement('div');
  counterCard.className = 'stat-card';
  const ch = document.createElement('h3');
  ch.textContent = 'Counters';
  counterCard.append(ch);
  const cp = document.createElement('p');
  cp.textContent = `${doneCounters} of ${counters.length} counted trophies have hit their target. Counters are tracked per trophy in its guide pane.`;
  counterCard.append(cp);
  grid.append(counterCard);
  container.append(grid);
}
