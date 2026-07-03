# F1 Intelligence Hub — Session Notes

## Project Overview
**F1 Intelligence Hub** — a full-stack Formula 1 stats/analytics app.

**Backend:** FastAPI (Python) + Uvicorn, using FastF1/Ergast (via Jolpica) for race data, Pandas/NumPy/SciPy for processing, Matplotlib for plotting, Pydantic for validation.
- Structure: `app/main.py`, `app/routers/{races,drivers,standings,seasons,history}.py`, `app/services/ergast_service.py`, `app/config.py`
- No `.env` required — defaults work locally
- Runs on `http://localhost:8000` (docs at `/docs`)

**Frontend:** React 19 + Vite 8, React Router v7, Recharts, Axios, Tailwind CSS v4 (installed but not wired up), ESLint.
- Structure: `pages/{Dashboard via App.jsx, DriverProfile, Compare}`, `services/api.js`, `data/driverData.js`
- Requires `.env` with `VITE_API_URL=http://localhost:8000/api/v1`
- Runs on `http://localhost:5173` (or next available port)

---

## Part 1: Getting It Running Locally on Windows

### Issues hit & fixes:
1. **`uvloop` doesn't support Windows** — caused `pip install -r requirements.txt` to fail partway through, so FastAPI never installed (`ModuleNotFoundError: No module named 'fastapi'`).
   - **Fix:** Deleted the `uvloop==0.22.1` line from `requirements.txt` entirely (it's a Unix-only performance extra for uvicorn, not required).

2. **Typo introduced while editing** — `cffi==2.0.0S` (stray "S"). Fixed to `cffi==2.0.0`.

3. **PowerShell command pasting issues** — pasting multiple commands (`cd`, venv activate, pip install, uvicorn) together caused them to queue and execute out of order/incorrectly (e.g., `cd backendn`, uvicorn starting in the wrong directory). **Fix:** run one command at a time, wait for it to finish.

4. **Missing `.env` in frontend** — `api.js` reads `import.meta.env.VITE_API_URL` with no fallback, so without `.env` the axios `baseURL` was `undefined`.
   - **Fix:** created `frontend/.env` with:
     ```
     VITE_API_URL=http://localhost:8000/api/v1
     ```
   - Vite only reads `.env` at startup — dev server must be restarted after creating/editing it.

### Final working run sequence:

**Backend** (Window 1):
```powershell
cd C:\Users\Aman\Downloads\f1-intelligence-hub-main\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Frontend** (Window 2 — separate window, both must run simultaneously):
```powershell
cd C:\Users\Aman\Downloads\f1-intelligence-hub-main\frontend
npm run dev
```

Verify backend directly: `http://localhost:8000/api/v1/drivers/2025/standings` should return JSON standings data.

---

## Part 2: Frontend Crash — Blank Page

**Symptom:** `localhost:5173` loaded blank / standings tables empty.

**Root cause 1 (crash):**
```
TypeError: Cannot read properties of undefined (reading 'filter')
at Dashboard (App.jsx:34)
```
`drivers.filter(...)` broke because `setDrivers(r.data.standings)` could receive `undefined` if the response shape didn't match expectations.

**Fix:** Defensive defaults in `App.jsx`:
```js
api.get("/drivers/2025/standings")
  .then((r) => setDrivers(r.data.standings || []))
  .catch(console.error);
api.get("/standings/2025/constructors")
  .then((r) => setConstructors(r.data.standings || []))
  .catch(console.error);
```

**Root cause 2 (empty tables):** The backend server had actually stopped running (only one PowerShell window was active, running whichever process was started last). Needed **two separate terminal windows** running concurrently — one for `uvicorn`, one for `npm run dev`.

**Note:** Some confusing red console errors (`httpStatus: 200, code: 403`) turned out to be unrelated — coming from a browser extension (Monica AI), not the app itself. Identified via Network tab showing `content.js`, `content.css`, `monicalogo.png`.

---

## Part 3: Complete UI Redesign — "Velocity Glass"

A new UI was designed externally (via Stitch export: `stitch_butter_and_glass_suits.zip`) containing 4 screens (Dashboard, Driver Standings, Comparison, Driver Profile) plus a `DESIGN.md` design system spec.

### Design System: "Velocity Glass"
- **Aesthetic:** Glassmorphism + minimalism — "Crystalline Precision." Dark, full-screen, single-page canvas with no sidebars.
- **Colors:** Deep midnight background (`#050508`), glass surfaces (white at 2–10% opacity), Electric Cyan primary (`#00f0ff`/`#dbfcff`), Vivid Violet secondary (`#7000ff`/`#d1bcff`).
- **Typography:** Plus Jakarta Sans (headlines), Inter (body), Geist (labels/nav).
- **Key components:** Floating pill-shaped glass nav (fixed, 24px from top), glass cards with backdrop-blur ~40-64px and gradient light-catch borders, buttery 300ms cubic-bezier transitions.

### Implementation
Rebuilt the frontend to match this design **while keeping all real API data wired in** (not the static mockup content from the Stitch export). Did not introduce Tailwind config (kept the existing inline-style + CSS-file pattern already used in the project) to avoid extra build-config risk.

**New/changed files:**
| File | Change |
|---|---|
| `src/theme.css` | **New.** Full design system: CSS variables, `.vg-glass`, `.vg-nav`, `.vg-table`, `.vg-btn-primary`, `.vg-input`, `.vg-chip`, animations |
| `src/index.css` | **Rewritten.** Removed old Vite template styles (`#root { width: 1126px }`, centered text, light/dark mode vars) that conflicted with the full-bleed dark layout |
| `src/components/Layout.jsx` | **New.** Shared floating glass nav + ambient background glow wrapper used on every page |
| `src/App.jsx` | **Rewritten.** Dashboard: hero championship-leader glass card, stat cards, glass search bar, driver + constructor standings tables — all populated from live `/drivers/2025/standings` and `/standings/2025/constructors` |
| `src/pages/Compare.jsx` | **Rewritten** with glass aesthetic; same comparison logic/data fetching preserved |
| `src/pages/DriverProfile.jsx` | **Rewritten** with glass aesthetic; same `driverData.js` static bio/stats data preserved |
| `index.html` | Added Google Fonts (`Plus Jakarta Sans`, `Geist`, `Inter`) |

**Delivered as:** `velocity_glass_update.zip` containing all new/changed files at their correct relative paths, to be manually copied into the local project (`frontend/src/...`, `frontend/index.html`) since Claude cannot write directly to the user's machine.

### To apply:
1. Extract `velocity_glass_update.zip`
2. Copy files into `frontend/` at matching paths, overwriting existing ones
3. Restart `npm run dev` and refresh the browser

---

## Outstanding / Next Steps
- Confirm the new UI renders correctly locally after copying files in
- Consider wiring up Tailwind properly later if more design-system-driven work is planned (currently unused despite being a dependency)
- `Navbar.jsx` component file exists but is empty/unused — now superseded by `Layout.jsx`
- Backend has known technical debt from earlier sessions (see memory): no auth on endpoints, no unit tests
