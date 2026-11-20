// Vice City Trophy Guide: a gta6-trophy-guide-01 entry (Node 22, standard library
// only). The guide itself is app/: plain static files that open at app/index.html
// in desktop Chrome and work with the network off. This program hands it in: it
// copies app/ and screenshots/ from beside this file into /output (or
// MAKEFUN_OUTPUT_DIR outside the grader) and writes /output/dossier.json with
// the vendored make.fun library, which the sealed scorer re-builds byte for byte.
//
// Run it locally first:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// then check out/ with the kit: node cli/makefun.mjs check --repo <this repo>
//
// vendor/makefun-frontend.ts is the kit's copy, unchanged.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps from the competition's reference/gate.json: the text cap
// shapes the dossier's bytes; the other caps refuse an entry the scorer would
// refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and
// directories in app/ or 48 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
