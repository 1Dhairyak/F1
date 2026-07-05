# F1 Intelligence Hub

A full-stack Formula 1 stats and analytics app — live standings, race results, driver profiles, and head-to-head driver comparisons, built on top of the [Jolpica Ergast API](https://api.jolpi.ca/ergast/).

## Tech Stack

**Backend:** FastAPI (Python) + Uvicorn, httpx for async HTTP, Pydantic for validation and settings management.

**Frontend:** React 19 + Vite, React Router v7, Axios.

## Project Structure

```
backend/
  app/
    main.py                  # FastAPI app, CORS, router registration
    config.py                # Settings (env-driven)
    routers/
      races.py               # Schedule, race results, qualifying
      drivers.py             # Driver list, standings, profile, compare
      standings.py           # Constructor standings
      seasons.py             # Seasons list, circuits
      history.py             # Champions by year, per-driver history
    services/
      ergast_service.py      # Ergast API client
  tests/
  requirements.txt
  requirements-dev.txt

frontend/
  src/
    App.jsx                  # Routes + Dashboard
    pages/
      DriverProfile.jsx
      Compare.jsx
    components/
      Layout.jsx              # Shared nav + page shell
      DriverLink.jsx
    data/
      driverData.js           # Static driver bios/stats/images
    services/
      api.js                  # Axios instance
  package.json
```

## Running Locally

No `.env` is required for the backend — sensible defaults are baked in.

**Backend** (terminal 1):
```powershell
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
API docs available at `http://localhost:8000/docs`.

**Frontend** (terminal 2 — must run at the same time as the backend):
```powershell
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`. Requires a `frontend/.env` (see `.env.example`):
```
VITE_API_URL=http://localhost:8000/api/v1
```

## API Overview

All routes are prefixed with `/api/v1`.

| Route | Description |
|---|---|
| `GET /races/{season}` | Season schedule |
| `GET /races/current/last` | Most recent race results |
| `GET /races/{season}/{round}/results` | Results for a specific race |
| `GET /races/{season}/{round}/qualifying` | Qualifying results |
| `GET /drivers/{season}/list` | Drivers competing in a season |
| `GET /drivers/{season}/standings` | Driver championship standings |
| `GET /drivers/profile/{driver_id}` | Driver profile + season race-by-race chart |
| `GET /drivers/compare?driver1=&driver2=&season=` | Head-to-head stats for two drivers |
| `GET /standings/{season}/constructors` | Constructor championship standings |
| `GET /seasons` | All available seasons |
| `GET /seasons/{season}/circuits` | Circuits used in a season |
| `GET /history/champions` | World champions, 2015–2025 |
| `GET /history/driver/{driver_id}` | A driver's standing in each season, 2015–2025 |

## Known Limitations / Roadmap

- No authentication or rate limiting on backend endpoints
- No global exception handler in `main.py`
- The Ergast response cache is unbounded and has no TTL — long-lived processes can serve stale data for time-sensitive endpoints (e.g. `races/current/last`)
- Zero automated test coverage (`backend/tests/` scaffolding exists but is empty)
- Tailwind CSS is installed on the frontend but not currently wired in; UI styling is inline-style + plain CSS (`theme.css`, `index.css`)

## License

Personal project — no license specified.
