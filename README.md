# marriage-proposal

A scroll-driven "electronic love letter" — a static single-page marriage-proposal site, hosted on GitHub Pages and shared through a private link. She opens it alone and, as she scrolls, reads our story section by section, building up to the proposal.

- Repo: `howieyuen/marriage-proposal`
- Site: `https://howieyuen.github.io/marriage-proposal/`

## Structure

```
index.html            Page structure: entry gate + 10 sections + success overlay + ending
css/style.css         Visual system & layout (clean warm tone)
js/
  gate.js             Entry-gate answer normalization / matching (unit-tested)
  counter.js          "Days together" calculation (unit-tested)
  reveal.js           IntersectionObserver scroll fade-in
  proposal.js         Proposal buttons: dodging "no" + "yes" -> success overlay + petals
  music.js            Background-music toggle
  main.js             Entry wiring
tests/                node --test unit tests (gate / counter)
scripts/optimize.py   Generate assets/img from a local private album via sips (standalone compressed files)
assets/img/           Compressed photos (published with the site)
robots.txt / .nojekyll
prototype/            Interactive prototype (brainstorm-phase artifact, reference only)
```

> The design doc and implementation plan live locally under `docs/` (`design.md` / `plan.md`). They contain private information and are excluded via `.gitignore` — never published with the public repo.

## Local preview

ES modules must be served over http (`file://` is blocked by browser CORS):

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

## Tests

```bash
node --test        # pure-logic unit tests (gate / counter), zero deps, Node >= 18
```

## Regenerate images

```bash
python3 scripts/optimize.py    # reads ~/privacy/{婚纱,素材}, writes assets/img/*.jpg
```

> Original full-resolution photos and `~/privacy` are **not committed** — only compressed images ship.

## Privacy

GitHub Pages is public hosting; the entry gate is just a front-end trick, **not real encryption** (enough to keep unrelated people from stumbling in, but not a security boundary). Simply don't spread the link.
