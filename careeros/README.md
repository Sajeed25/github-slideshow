# Pathwise — the Career OS (prototype)

**Category:** Career Intelligence Platform. Not "a job portal". The product answers *"What should I do next in my career?"* and stays with the user from college to lifelong growth.

**Run it:** no build step. `python3 -m http.server --directory careeros 8000` → http://localhost:8000
**Test it:** `node careeros/tests/engine.test.js` (18 engine tests). Tap "try it as a demo student (Rahul)" on the landing page for a populated profile.

## What is built (working, mobile-first)
| Brief section | Where |
|---|---|
| Conversational onboarding (§8) | `app.js` onboarding: one question at a time, "not sure yet" path |
| Homepage + journey chooser (§9) | landing |
| Personalized home: readiness, next best action (§10) | `home()` |
| Career Graph / Living profile (§3-4) | user object in `engine.js` header; Profile screen |
| Match engine: Match, Readiness, Skill gap (§6) | `matchOpp`, `readiness`, `skillGaps` |
| Next Best Action with *simulated* impact (§10, §18) | `nextActions` re-scores a hypothetical profile |
| Opportunity discovery, one graph for jobs/internships/projects/hackathons/freelance/campus (§7, §11) | Explore |
| "Why should I care" job cards, shortlist probability, apply advice (§12, §18) | `jobCard`, `jobPage` |
| Experience Builder (§13) | `#/evidence`, live before/after statement |
| Verified skills + confidence (§14) | quizzes, project-backed evidence, confidence levels |
| Trust layer, fraud shield, report job/recruiter/company (§15-16) | `assessFraud`, Fraud shield page, job page |
| Application tracking + analytics (§17) | Applications (guards against claims from <3 samples) |
| Resume intelligence: resume vs job (§19) | "Optimize my resume for this job" |
| Interview coach (§20) | `#/interview` (heuristic scoring, labelled as such) |
| Career simulator with estimate disclaimers (§21) | `#/sim` |
| Learning tied to gaps → project → verify → apply (§22) | `#/path` |
| Career Copilot everywhere (§5, §32) | Copilot tab + on each job page; grounded in the graph |
| Recruiter product + natural-language talent search (§26-27) | `#/recruiter` |
| College placement dashboard (§28) | `#/college` |
| Career Readiness Score (§29) | `readiness()`: skills 35, projects 20, assessments 15, resume 10, experience 10, interview 10 |
| Bottom nav, Gen-Z but professional UI, dark mode (§30-31) | `styles.css` |

## Key design decisions
- **Match ≠ Readiness.** Match = do you fit (declared level vs need). Readiness = can you prove it (discounted unless assessed / backed by a project). The gap *is* the product: it tells users what to verify and build.
- **Impact is computed, not invented.** "+7% readiness" comes from re-scoring a cloned profile with the action applied.
- **Honesty guardrails.** The resume optimizer never tells users to claim skills they lack. Analytics won't claim a pattern from fewer than 3 applications. Simulator and salary data carry estimate disclaimers. Scam listings can't be applied to.
- **Safety:** all user text is HTML-escaped; data lives only in the browser's localStorage.

## Not built yet (be clear-eyed)
All data is **seed/synthetic**: listings, companies, salary bands, learning titles, and the 300-student cohort. Not implemented: real identity/education verification, GitHub analysis, peer/recruiter validation, proctored assessments, LLM-based interviewer/copilot, community, payments, employer self-serve posting, backend. Quiz is 3 questions and retakeable (gameable) — production needs item banks, timing and proctoring. Brief ended at §34 (business model); §35+ if any were not received.

## Production architecture (summary)
- **Clients:** React Native / PWA, web recruiter console, college console.
- **Services:** Identity & Trust · Career Graph (Postgres + graph/vector store) · Opportunity Graph (ingest, dedupe, fraud scoring) · Matching/Readiness (this engine, served + ML-calibrated on real outcomes) · Assessment · Copilot (LLM with tool-calls into the graph, never free-form facts) · Analytics · Billing.
- **Data flywheel:** application outcomes (viewed → shortlisted → hired) become training labels that replace today's hand-set weights; this is the moat.
- **Privacy:** consent-based sharing with recruiters; DPDP Act (India) compliance, data export/delete.

## Business model
Students: free core. Premium: deep career analytics, advanced resume tools, interview coaching, premium assessments.
Recruiters: pay for job posts, candidate search, AI screening, employer branding. Colleges: per-student SaaS for placement analytics.

## Go-to-market
Start with 20–30 tier-2/3 colleges via placement cells (supply of verified profiles), seed verified employers in one city (Hyderabad), lead with the fraud-shield trust message, then expand by role cluster.

## Roadmap
0–3 mo: real listings ingestion, auth + backend, LLM copilot, 10 assessments → 3–6 mo: recruiter self-serve, college pilots, identity verification → 6–12 mo: project marketplace, hackathon network, outcome-trained matching, community.
