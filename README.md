# marry-me

A scroll-driven "electronic love letter" — a static single-page proposal site, hosted on GitHub Pages and shared through a private link. She opens it alone and, as she scrolls, reads our story section by section, building up to the proposal.

- Repo: `howieyuen/marry-me`
- Site: `https://howieyuen.github.io/marry-me/`

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
assets/audio/bgm.mp3  Background music (fades in once the gate is answered, muted from the top-right button)
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

## Publish

`.github/workflows/deploy.yml` handles deployment: every push to `main` runs the unit tests first and deploys only if they pass.

> **A push to `main` puts the site live.** That is the spoiler-sensitive moment — make sure the copy and photos are final first.

First publish, one time only:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** Pages is not enabled on this repo yet; without this the deploy job fails even though the tests pass.
2. `main` and `origin/main` have unrelated histories — the remote still holds nothing but its initial commit — so the first push replaces it:
   ```bash
   git push --force-with-lease origin main
   ```
3. Watch the run with `gh run watch`, or the Actions tab.
4. Open `https://howieyuen.github.io/marry-me/` and check it on a phone too.

Every update after that:

```bash
git push origin main
```

To redeploy without a new commit: Actions → *Test & Deploy to GitHub Pages* → **Run workflow**.

## Regenerate images

```bash
python3 scripts/optimize.py    # reads ~/privacy/{婚纱,素材}, writes assets/img/*.jpg
```

> Original full-resolution photos and `~/privacy` are **not committed** — only compressed images ship.

## Credits

Background music: *Eternal Hope* by Kevin MacLeod ([incompetech.com](https://incompetech.com/)), licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/). Re-encoded to 128 kbps for the web; the original is unmodified otherwise.

## Privacy

GitHub Pages is public hosting; the entry gate is just a front-end trick, **not real encryption** (enough to keep unrelated people from stumbling in, but not a security boundary). Simply don't spread the link.
