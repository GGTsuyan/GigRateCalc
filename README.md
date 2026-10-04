# Gig Rate Calc

Week 2 Documentation (Week of 2026-09-18 to 2026-09-26)

AI use and authorship are documented in [AI-USAGE.md](AI-USAGE.md).

## Overview

Gig Rate Calc is a full-stack app for calculating and saving freelance editing quotes. It helps a freelance editor estimate a job price based on details such as word count, turnaround time, complexity, and preferred rate, then review and reuse previous quotes instead of starting from scratch each time.

## Setup and installation

Prereqs:
- Node.js (v18+ recommended)
- PostgreSQL (13+)
- npm

Get the code and install dependencies:

```bash
git clone https://github.com/GGTsuyan/GigRateCalc/tree/main
cd gig
npm install
cd client
npm install
```

Environment variables (create a `.env` in the project root):

```env
DATABASE_URL=postgres://dbuser:dbpass@localhost:5432/gig_dev
PORT=4000
CLIENT_PORT=5173
VITE_API_BASE=http://localhost:4000
```

Database setup:

```bash
createdb gig_dev
# or: psql -c "CREATE DATABASE gig_dev;"
```

Schema and seed:
- The project schema is defined in `db/schema.js`.
- The server applies the schema automatically at startup through `createSchema` in `db/schema.js`.
- There is no seed runner yet; create the database before starting the server.

## How to run it

Start the backend from the project root:

```bash
npm start
```

Start the frontend in development mode:

```bash
cd client
npm run dev
```

Expected addresses:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

If the app does not start, check that PostgreSQL is running, the database exists, and the environment variables are configured correctly.

## Features and usage

- Quote entry: enter project details such as word count, complexity, turnaround, and rate.
- Instant calculation: see a live estimate based on the current inputs.
- Save quotes: store completed estimates for later review.
- History: revisit previous quotes and reuse them for similar work.
- Settings: manage default pricing assumptions and app preferences.

API endpoints:
- `GET /api/quotes` — list saved quotes
- `POST /api/quotes` — create a new quote
- `GET /api/rates` — list saved rate settings
- `POST /api/rates` — create or update rate data

## Project structure

- `client/` — React + Vite frontend
- `server/` — Express backend and route handling
- `db/` — PostgreSQL connection and schema setup
- `repos/` — database access layer for quotes and rates
- `pgdata/` — local Postgres data files

## Screenshots

Add at least one screenshot of the quote form and history screen so the app is easier to understand for graders and future users.

Suggested images:
- `screenshots/form.png`
- `screenshots/history.png`

## Known issues and next steps

- Startup reliability still needs work; the full stack is not yet completely stable in a fresh local environment.
- Database creation and schema application should be more automated.
- Validation and error handling still need to be improved on both the frontend and backend.
- The quote calculation logic should be tightened to better reflect real-world pricing rules.
- More sample data and tests would make the app easier to demo and evaluate.

## Week 2 report summary

### What changed this week
- Continued developing the full-stack app from the initial scaffold into a more complete prototype.
- Refined the backend to support quote and rate operations with Postgres.
- Expanded the frontend around the quote flow and saved history.
- Clarified the app purpose around freelance editing pricing.
- Improved the documentation so the project is easier to understand and run.

### Why
- The goal for Week 2 was to move beyond setup and into a usable interface for the main project flow.
- The app needed to prove that a user could enter job details, calculate a quote, and save the result in a meaningful way.
- This created a stronger foundation for the final polishing step in the next iteration.

### What broke or what I got stuck on
- Local startup still had reliability issues when the full stack was run in one environment.
- Database setup and configuration were not yet smooth enough for a fresh machine or a clean local clone.
- Some frontend/backend integration points needed more validation and clearer error handling.

### What is left
- Fix the startup flow and verify the app works consistently from a clean environment.
- Add stronger validation and better user feedback for errors.
- Improve the quote logic so it behaves more like a realistic pricing tool.
- Add sample data and screenshots to make the project easier to assess.

### How it is graded
- The project is evaluated on setup success, feature clarity, and honest documentation of what works and what still needs improvement.
- A clear README, working project flow, and realistic next steps are more important than claiming the app is fully finished when it is not.
