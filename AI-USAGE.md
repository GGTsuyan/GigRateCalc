# AI Usage Record

> The 70% AI-assisted / 30% personally written split below is my estimate, not a measured line-by-line count. Authorship descriptions are based on my account of the work. 

## 1. How I used AI

### Entry 1: Week 1 project increment report
- **Date / tool:** 2026-09-18, GitHub Copilot in VS Code.
- **What I asked:** Turn the current project state into a Week 1 increment report using the provided report template.
- **What it returned:** A summary of the app structure, progress, blockers, and next steps.
- **What I kept or changed, and why:** I used the report structure and adapted it to the project status and the two-week plan. I treated the suggested blockers as claims to check, not as proof of work I had completed.
- **Commit:** [ADD COMMIT LINK]

### Entry 2: Week 1 README documentation
- **Date / tool:** 2026-09-18, GitHub Copilot in VS Code.
- **What I asked:** Write the README documentation using the provided documentation guide.
- **What it returned:** Setup, run, feature, API, structure, screenshot, and known-issues sections.
- **What I kept or changed, and why:** I kept the documentation structure, but checked the startup behavior against `server/index.js` and the API base against `client/src/api.js`. I corrected the README's backend port and schema setup instructions to match the code.
- **Commit:** [ADD COMMIT LINK]

### Entry 3: Week 1 reflection journal
- **Date / tool:** 2026-09-18, GitHub Copilot in VS Code.
- **What I asked:** Fill in the reflection template for the first project week.
- **What it returned:** A journal draft covering the goal, work, blockers, learning, and next steps.
- **What I kept or changed, and why:** I used the journal structure to organize the week's goal, work, blockers, and learning. I treated generated descriptions as a draft and kept only statements that match what I remember doing.
- **Commit:** [ADD COMMIT LINK]

### Entry 4: App proposal
- **Date / tool:** 2026-09-18, GitHub Copilot in VS Code.
- **What I asked:** Fill out the app proposal for the existing Gig Rate Calc idea.
- **What it returned:** A proposed audience, screens, state model, screen content, required content, and technical risk.
- **What I kept or changed, and why:** I kept the proposal focused on the existing freelance quote-calculator idea. I treated optional screens and features as ideas, not as claims that they are already implemented.
- **Commit:** [ADD COMMIT LINK]

### Entry 5: Week 2 increment report and documentation update
- **Date / tool:** 2026-09-26, GitHub Copilot in VS Code.
- **What I asked:** Draft the Week 2 project increment report, documentation update, and reflection in the style of Week 1.
- **What it returned:** Draft narrative sections describing progress, blockers, learning, and follow-up work.
- **What I kept or changed, and why:** I used the requested report headings to organize the update, then kept the status and next steps that fit the project. I did not treat the generated narrative as evidence of implementation.
- **Commit:** [ADD COMMIT LINK]

### Entry 6: Week 2 README
- **Date / tool:** 2026-09-26, GitHub Copilot in VS Code.
- **What I asked:** Recreate the README with the Week 2 update.
- **What it returned:** A README draft combining setup and usage information with the Week 2 report summary.
- **What I kept or changed, and why:** I used the generated README as a draft and checked its setup and endpoint claims against the current source. I corrected the port and schema details and left speculative features out of the implemented-features list.
- **Commit:** [ADD COMMIT LINK]

## 2. Where the AI got it wrong

These are concrete problems visible in the drafts from this conversation. Add the commit that contains each correction using your repository history.

### Error 1: Incorrect backend port assumption
- **What the AI gave me:** A Week 1 README draft listed the backend at port `3000` and set `VITE_API_BASE` to `http://localhost:3000`.
- **What was wrong:** The existing README said the frontend expects the API at `http://localhost:4000` by default. The generated port was an assumption, not verified configuration.
- **What I did instead:** I checked `server/index.js` and `client/src/api.js`, which both use port `4000` by default, and changed the README's backend address and `PORT`/`VITE_API_BASE` examples to `4000`.
- **Commit:** [ADD COMMIT LINK]

### Error 2: Incorrect schema setup instruction
- **What the AI gave me:** It suggested manually applying SQL from `db/schema.js` and said schema setup was not automated.
- **What was wrong:** `db/schema.js` is JavaScript, not a standalone SQL file, and the original README stated that the backend creates the schema on startup. The advice contradicted the project documentation and implementation path.
- **What I did instead:** I checked `server/index.js`, which calls `createSchema(pool)` before listening, and updated the README to say schema creation happens on startup while database creation is still a prerequisite.
- **Commit:** [ADD COMMIT LINK]

### Error 3: Unsupported feature claims
- **What the AI gave me:** It described client-side settings persistence, quote export/reuse, pagination, and a send-quote action as existing or planned app features.
- **What was wrong:** Those details were not verified from the code; some were suggestions rather than implemented behavior. Presenting them as working features would mislead a reader.
- **What I did instead:** I checked the current UI and API and did not present quote export, pagination, or sending a quote as implemented features. I kept the README feature list to the current quote, history, and rate-setting flows.
- **Commit:** [ADD COMMIT LINK]

## 3. Who wrote what

My estimate is that AI generated or substantially shaped about 70% of the project code, while I personally wrote or substantially revised about 30%. My own work is spread across the quote and rates API/repository, database setup, and frontend. The descriptions below explain representative pieces; I will attach the commits that show those changes.

### Code I wrote myself

I personally worked on meaningful code in these areas. The 30% is my estimate across the project, not a claim that I wrote every line in these files.

- **File / feature:** `server/routes/quotesRoutes.js` — quote input checks and pricing calculation.
- **Commit:** [ADD COMMIT LINK]
- **My explanation:** I validate that the selected rate exists and that the client name, duration, and turnaround are usable before saving. The server calculates the quote from the stored base rate and applies the rush percentage when rush service is selected or the turnaround meets the rush threshold. Keeping the final calculation on the server means the saved total does not depend on the browser's preview.

- **File / feature:** `db/schema.js` — transactional creation of the rates and quotes tables.
- **Commit:** [ADD COMMIT LINK]
- **My explanation:** I create both related tables inside a transaction so startup either applies the schema changes together or rolls them back on failure. The foreign key links each quote to its rate and prevents deleting a rate still used by quotes.

- **File / feature:** `client/src/components/QuoteForm.jsx` — quote form state and live preview.
- **Commit:** [ADD COMMIT LINK]
- **My explanation:** I keep the current form values in component state, derive a preview from the selected rate and duration, and submit the values to the API. After a successful save, the form clears the job-specific fields and refreshes the quote and rate lists.

- **File / feature:** `server/routes/ratesRoutes.js` — rate input validation and CRUD routes.
- **Commit:** [ADD COMMIT LINK]
- **My explanation:** I validate the rate name and numeric values before sending them to the repository, and return appropriate errors when the input is invalid or a rate is missing. This keeps malformed settings from becoming pricing data.

### AI-written code I understand

One AI-assisted part I understand is the quote creation flow. The route validates request values, looks up the selected rate, calculates a rush-adjusted total, and passes the values to the repository, whose SQL uses parameters for insertion.

- **File / feature:** `server/routes/quotesRoutes.js` — quote creation flow (AI-assisted, with my own edits as described above).
- **Commit:** [ADD COMMIT LINK]
- **My explanation:** The endpoint first rejects invalid input, then fetches the selected rate from the database. It computes `base rate × duration × rush multiplier`, persists that server-computed value through the repository, and returns the saved quote with status `201`. I kept this design because validation and calculation happen at the API boundary, while parameterized SQL keeps request values out of the SQL statement itself.