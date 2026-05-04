# tribe Contest — Prototype

Functional prototype of the redesigned Audiotool/tribe Contest Page.

Live demo: _deployed via GitHub Pages — see Actions tab after first push_

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (tribe-themed palette)
- **React Router** for `/` (public) and `/admin`
- **localStorage** for state persistence (no backend)
- **GitHub Actions** for auto-deploy to GitHub Pages

## Why no backend?

Track submissions cannot use a real backend (they would need to integrate with the Audiotool platform). Everything else (votes, admin edits, removed-status, etc.) lives in the user's browser via localStorage. This is enough to demonstrate every flow of the page to developers — they will replace the localStorage layer with their proper backend.

## Architecture

```
src/
├── components/
│   ├── public/      # Public-facing contest page
│   ├── admin/       # Admin tabs (10 sections)
│   └── shared/      # Reusable UI primitives
├── data/            # Initial JSON data (overridden by localStorage edits)
├── hooks/           # useLocalStorage etc.
├── lib/             # store, contest helpers, color extraction
├── types/           # TypeScript interfaces
└── styles/          # Tailwind base
```

### Data flow

1. On first load: data comes from `src/data/*.json`
2. Any user action (vote, admin edit, status change) updates the React store
3. Store automatically syncs to localStorage
4. On reload: localStorage wins over JSON
5. Admin can hit "Reset prototype" to wipe localStorage and restore JSON state

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Admin access

Go to `/admin` and use password: `tribe2026`

(For prototype only. Devs will implement role-based auth.)

## Deployment

Pushes to `main` auto-deploy via GitHub Actions.

To enable GitHub Pages:
1. Repo Settings → Pages
2. Source: **GitHub Actions**

Then push to main, wait ~1 minute, site is live at `https://<username>.github.io/tribe-contest/`.

## Status

- [x] Project scaffold
- [x] Types & data model
- [x] localStorage-backed store
- [x] Routing & admin auth stub
- [ ] Public page UI (in progress)
- [ ] Admin tabs (in progress)
- [ ] GitHub Pages deploy

## Notes for devs

- Every state mutation that should persist must go through `useStore()` setters — they auto-save.
- `computePhase(contest)` derives the phase from the 4 dates. Override via `devPhase` for previews.
- `computeWinners(submissions, votes)` ranks by vote points.
- Audit log entries are auto-added via `addAudit()` from store.
