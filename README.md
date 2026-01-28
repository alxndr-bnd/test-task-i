# Ranking PoC

Prototype for a course ranking system with explainable scoring, admin controls, and seeded demo data.

Requirements: `docs/prototype-requirements.md`

## Local setup

1) Install dependencies
```bash
npm install
```

2) Initialize database and seed demo data
```bash
npx prisma migrate dev
npm run db:seed
```

3) Run the app
```bash
npm run dev
```

Open http://localhost:3000

## Admin

- User view: `/`
- Admin view: `/admin`

Admin lets you edit ranking weights, quality floor, and course flags (Sponsored / Editor’s Choice / Accredited) with promo windows.

## Demo data consistency

Yes — the seed data is deterministic.
It uses a fixed seed and a fixed base date, so local and production will generate the same ~50 courses.

To reset the dataset at any time:
```bash
npm run db:seed
```

## Notes

- Sorting options change the list order but do not change the computed ranking score.
- Ranking calculation details are shown in the UI for PoC transparency only.
