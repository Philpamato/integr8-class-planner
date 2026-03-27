# Integr8 Class Planner

Internal tool for Integr8 Martial Arts coaches to create, manage, and submit structured class plans.

## Features

- **Plan generator** — coaches fill in style, age group, focus notes and the system builds a full structured class plan automatically
- **Phase structure** — every plan follows: Warm-Up → Drilling → Technique → Conditioning → Sparring → Cool-Down
- **Quarterly skill rotation** — themes cycle every quarter: Footwork & Movement (Q1) → Defense & Guard (Q2) → Attack & Combinations (Q3) → Sparring & Application (Q4)
- **Drill library** — searchable/filterable by style, focus area, and difficulty. Coaches can add new drills at any time
- **Submission workflow** — coaches submit plans as drafts; Head of Fulfillment approves. Tracks dates and status
- **Print / PDF export** — use browser print to PDF from any plan page
- **Two locations** — Bentleigh and Cheltenham tracked separately

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — local SQLite database

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### Install & run

```bash
npm install
npm run db:seed   # Populate the drill library (run once)
npm run dev       # Start dev server at http://localhost:3000
```

### Production build

```bash
npm run build
npm start
```

## Usage

1. **Coaches** — go to `/plans/new`, fill in the form, and click **Generate Plan**
2. Review the auto-generated plan phases and drills
3. Click **Submit Plan** when ready
4. **Head of Fulfillment** — review submitted plans and click **Approve**
5. Plans can be printed to PDF from any plan page

## Quarterly Rotation

| Quarter | Months | Theme |
|---------|--------|-------|
| Q1 | Jan – Mar | Footwork & Movement |
| Q2 | Apr – Jun | Defense & Guard |
| Q3 | Jul – Sep | Attack & Combinations |
| Q4 | Oct – Dec | Sparring & Application |

## Directory Structure

```
src/
  app/             # Next.js pages and API routes
    api/plans/     # REST endpoints for plans
    api/drills/    # REST endpoints for drills
    plans/         # Plan list, new plan, plan detail
    drills/        # Drill library UI
  components/      # Shared React components
  lib/
    db.ts          # SQLite connection and schema init
    generator.ts   # Plan generation logic
    types.ts       # TypeScript types
  data/
    seed.ts        # Initial drill library data
data/
  integr8.db       # SQLite database (auto-created, gitignored)
```
