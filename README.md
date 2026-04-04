# Typing Pro (Frontend-only)

A professional **offline-first typing platform** built with **React + Vite only** (no backend).  
All data is stored locally in browser storage via Zustand persistence.

## Setup

```bash
cd typing-pro
npm install
npm run dev
```

## Build (production)

```bash
npm run build
npm run preview
```

## Offline / PWA

- **Offline support**: implemented via a lightweight service worker at `public/sw.js`
- **Manifest**: `public/manifest.webmanifest`
- In development, the service worker is not registered (to avoid caching issues). In production builds it registers automatically.

## Project structure

- `src/components/`: reusable UI + feature components
- `src/pages/`: route pages (test, practice, lessons, games, dashboard, etc.)
- `src/hooks/`: shared hooks (boot, etc.)
- `src/store/`: Zustand stores (settings, history, analysis, achievements)
- `src/utils/`: generators, storage helpers, pwa registration
- `src/data/`: offline word lists (English + Nepali)

## Notes

- **No backend**: all progress, settings, and analytics stay on-device.
- **Typing engine**: character-level rendering with mistake highlighting, caret tracking, WPM/CPM/accuracy, and timer modes.
- **Charts**: built with Chart.js (`react-chartjs-2`).
- **Certificate**: PDF generation via `jsPDF`.
