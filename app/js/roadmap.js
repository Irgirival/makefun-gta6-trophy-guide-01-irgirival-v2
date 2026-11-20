// The 5-stage roadmap to the platinum, and the missables page.
// Built from the official descriptions and the cited guides (PowerPyx, KeenGamer,
// GTA Zone): story first, then character quests, then activities, then
// collectibles and crime, with 100% Completion last. Difficulty 4/10, ~200 hours.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story, don\u2019t miss the balcony',
    hours: 'Chapters 1\u20132 \u00b7 about 30 hours',
    blurb:
      'Play the five-chapter story and take optional missions as they appear. Scan vehicles and study animals as you go: the counts start now and the rare spawns are the long tail later. Two things matter in this stage and nowhere else.',
    tips: [
      'After the Chapter 1 mission Down to Earth, talk to Lucia in the kitchen at Jason\u2019s house in the morning, follow her to the balcony and choose Accept. That meditation is only offered in Chapter 1.',
      'Register vehicles to the Scooter Bros app once Moses gives it to you in Chapter 2; keep a garage space free for each one.',
      'Beat Cal in his fishing challenge when he texts you after a Chapter 1 mission.',
      'Save at the start of every chapter: there is no mission replay.',
    ],
  },
  {
    stage: 2,
    title: 'Finish the story',
    hours: 'Chapters 3\u20135 \u00b7 about 30\u201350 hours',
    blurb:
      'Play through to the final mission. Every chapter and mission trophy pops automatically; none of them can be missed. Bank vaults open up with an optional Chapter 4 mission, and Yasmani\u2019s Chapter 3 jobs give you the Snap Gun for the jewelry store.',
    tips: [
      'Complete the final mission to earn the hidden gold and roll into free roam.',
      'Keep scanning vehicles and studying animals: 200 of 277 vehicles and 100 of 255 animals are needed for 100%.',
      'Do not use cheats: they disable trophies and saving.',
    ],
  },
  {
    stage: 3,
    title: 'Character quests & strangers',
    hours: 'About 10\u201320 hours',
    blurb:
      'Finish the five character questlines and the eight counting Strangers & Freaks strands. Quest givers tied to trophies become available again after the story, so nothing here is missable.',
    tips: [
      'Andy is Lucia-only; Tyrone and Bret are Jason-only.',
      'For Strangers & Freaks only Kirk, Kyle, Yago and Pilot Pete count; Moses, Tyrone, Yasmani, Andy and Billy do not.',
      'Billy\u2019s five jobs start at the Thrillbilly Mudclub in Kelly County.',
      'Try each type of activity once for Master of None.',
    ],
  },
  {
    stage: 4,
    title: 'Activities, combat & partners',
    hours: 'About 40\u201360 hours',
    blurb:
      'The grind stage: stunts, shooting range golds, races, drone races, challenges and the partner and combat trophies. Do these in free roam, where you control the pace.',
    tips: [
      '250 stunts of 397 (300 for 100%); 42 shooting-range golds across 12 ranges.',
      '20 different race wins of 40; one drone-race win at each of 14 locations.',
      '50 of the 80 Challenges (70 for 100%).',
      'Max out Strength for both Jason and Lucia together for Personal Best.',
    ],
  },
  {
    stage: 5,
    title: 'Collectibles, crime & 100%',
    hours: 'About 60\u201380 hours',
    blurb:
      'Sweep the collectibles, finish the robberies, launder the marked bills and close out the 100% Completion checklist. A Long Road, the gold for 100%, is the hardest trophy on the list; the platinum pops right after it.',
    tips: [
      '3 card sets of 18; 100 WAiNK locations; 100 vehicles scanned; explore all of Leonida.',
      '5 bank vaults of 8; one Illegal Operation per gang (9 gangs); $250,000 laundered, Yasmani pays most.',
      'Buy the 8 garages for sale (about $160,000); the 4 story garages do not count.',
      'Check Progress > Stats > 100% Completion for what is left: nothing on it is missable.',
    ],
  },
];

export function renderRoadmap(container, trophies, progress, spoilerSafe) {
  container.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const members = trophies.filter((t) => t.stage === stage.stage);
    const earned = members.filter((t) => progress.earned[t.name]).length;
    const card = document.createElement('article');
    card.className = 'stage-card';
    const h = document.createElement('h3');
    h.textContent = `Stage ${stage.stage}: ${stage.title} `;
    const hours = document.createElement('span');
    hours.className = 'stage-hours';
    hours.textContent = stage.hours;
    h.append(hours);
    card.append(h);
    const p = document.createElement('p');
    p.textContent = stage.blurb;
    card.append(p);
    const prog = document.createElement('p');
    prog.className = 'stage-progress';
    prog.textContent = `${earned} of ${members.length} trophies earned in this stage`;
    card.append(prog);
    const ul = document.createElement('ul');
    ul.className = 'stage-trophies';
    for (const t of members) {
      const li = document.createElement('li');
      const masked = spoilerSafe && t.hidden && !progress.earned[t.name];
      li.textContent = `${progress.earned[t.name] ? '\u2713 ' : '\u25cb '}${masked ? 'Hidden trophy' : t.name} (${t.grade})`;
      if (progress.earned[t.name]) li.className = 'done';
      ul.append(li);
    }
    card.append(ul);
    const tips = document.createElement('ul');
    for (const tip of stage.tips) {
      const li = document.createElement('li');
      li.textContent = tip;
      tips.append(li);
    }
    card.append(tips);
    container.append(card);
  }
}

export function renderMissables(container, trophies) {
  container.replaceChildren();
  const warn = document.createElement('div');
  warn.className = 'warning-card';
  const h = document.createElement('h3');
  h.textContent = '\u26a0 The one possibly missable trophy: Positive Mental Attitude';
  warn.append(h);
  const intro = document.createElement('p');
  intro.textContent =
    'PowerPyx flags exactly one trophy as potentially missable, and only as a maybe. Meditate at every spot across Leonida: 18 spots in 10 locations, with Jason and Lucia. Do the Chapter 1 step below and the rest can be done any time.';
  warn.append(intro);
  const steps = document.createElement('ol');
  const stepTexts = [
    'Play Chapter 1 until you finish the mission Down to Earth.',
    'In the morning, talk to Lucia in the kitchen at Jason\u2019s house. She says she is going to meditate.',
    'Follow her to the balcony and choose Accept. She shows you how to meditate.',
    'That balcony meditation is only offered in Chapter 1. It is unconfirmed whether the trophy needs it: PowerPyx\u2019s author did it and then earned the trophy, so do it to be safe.',
    'The last spots need Jason and Lucia playable together, which opens after Chapter 2 (Coffee Break).',
    '100% Completion only asks for 15 of the 18 spots, so the missable one cannot cost you A Long Road.',
  ];
  for (const s of stepTexts) {
    const li = document.createElement('li');
    li.textContent = s;
    steps.append(li);
  }
  warn.append(steps);
  const src = document.createElement('p');
  src.textContent = 'Sources: PowerPyx, KeenGamer, GTA Zone.';
  warn.append(src);
  container.append(warn);

  const safe = document.createElement('div');
  safe.className = 'note-card';
  const sh = document.createElement('h3');
  sh.textContent = 'Everything else can be done after the story';
  safe.append(sh);
  const sp = document.createElement('p');
  sp.textContent =
    'There is free roam after the credits, no mission replay, and no New Game+. Story trophies cannot be missed, nothing on the 100% checklist is missable, and every quest giver tied to a trophy becomes available again. Optional missions with an hourglass expire, but they do not count for trophies.';
  safe.append(sp);
  const cheat = document.createElement('p');
  cheat.textContent =
    'Cheats disable trophies and saving. The 61 cheats only unlock after the story; save before you cheat and keep trophy runs cheat-free.';
  safe.append(cheat);
  container.append(safe);

  const unconfirmed = trophies.filter((t) => t.unconfirmed);
  const unc = document.createElement('div');
  unc.className = 'note-card';
  const uh = document.createElement('h3');
  uh.textContent = `Unconfirmed trophies (${unconfirmed.length})`;
  unc.append(uh);
  const up = document.createElement('p');
  up.textContent =
    'No guide has pinned down the exact trigger for these yet. This guide flags them rather than guessing; check the cited sources as players crack them.';
  unc.append(up);
  const ul = document.createElement('ul');
  for (const t of unconfirmed) {
    const li = document.createElement('li');
    li.textContent = `${t.name} \u2014 ${t.description}`;
    ul.append(li);
  }
  unc.append(ul);
  container.append(unc);
}
