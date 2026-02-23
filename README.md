# web-app-ruta-visualizer

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL%202.0-F77F00?style=flat-square&logo=mozilla)](LICENSE)

---

## Why

Understanding vehicle trip patterns requires more than spreadsheets. Ruta Visualizer transforms raw GPS data into interactive maps, enabling quick analysis of routes, speeds, and trip statistics.

---

## What

- **Interactive Maps** — Visualize GPS routes on Leaflet maps with click-to-select trips
- **Real-time Statistics** — Distance, duration, average and max speed calculated from GPS points
- **Smart Filtering** — Filter by vehicle, platform, or date range to find relevant trips

---

## How

### Prerequisites

- Node.js 20+
- npm
- Supabase account (for data storage)

### Installation

```bash
git clone https://github.com/crias-solutions/web-app-ruta-visualizer.git
cd web-app-ruta-visualizer
npm install
```

### Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Run

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Usage

### Filter Trips

Use the sidebar filters to narrow down trips by:
- Vehicle type
- Platform
- Date range

### View Trip Details

1. Click a trip in the list or on the map
2. See statistics: distance, duration, speeds
3. Route highlights on the map

---

## Reference

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Database | Supabase |
| Maps | Leaflet + React-Leaflet |
| CSV Parsing | PapaParse |
| Testing | Vitest + Testing Library |

### Project Structure

```
src/
├── components/       # React components
│   ├── Map.tsx
│   ├── StatsDashboard.tsx
│   ├── TripFilters.tsx
│   └── TripList.tsx
├── hooks/            # Custom React hooks
│   └── useSupabase.ts
├── utils/            # Utility functions
│   ├── gpsParser.ts
│   └── tripStats.ts
├── test/             # Test files
├── types.ts          # TypeScript interfaces
├── App.tsx           # Main component
└── main.tsx          # Entry point
```

---

## License

This project is licensed under the [Mozilla Public License 2.0](LICENSE).
