# makefun-gta6-trophy-guide-01-irgirival-v2

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Irgirival/makefun-gta6-trophy-guide-01-irgirival-v2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Irgirival/makefun-gta6-trophy-guide-01-irgirival-v2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Vice City Trophy Guide — the offline guide and tracker for all 55 GTA 6 PlayStation 5 trophies: official names, descriptions and grades, a 5-stage roadmap to the platinum (~200 hours, difficulty 4/10), the one possibly missable trophy flagged everywhere, and a cited guide in our own words for every trophy. The tracker saves progress in the browser (localStorage), with per-trophy count steppers, search, filters by kind and grade, sort orders, hide-earned, a spoiler-safe mode that keeps hidden story trophies hidden until earned, stats by grade, kind and stage, and export/import as JSON. Static files, no build step, zero network requests at runtime.

## Run it

```sh
python3 -m http.server --directory app 8080
# open http://localhost:8080
```

Or serve `app/` with any static file server. `node main.ts` (with `MAKEFUN_OUTPUT_DIR=out`) hands the entry in: it copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=kfz6780b&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
