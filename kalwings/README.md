# Kalwings — public website & platform

> Your potential deserves to be seen.

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Radix Slot + CVA (shadcn-style components).

## Status

| Phase | Status |
| --- | --- |
| 1. Design system + full homepage (all 17 sections) | Built |
| 2. Public pages: Students, Employers (pricing), Colleges, Mentors (directory + profiles), Opportunities (filters + detail), Challenges, Community, About, Press, Contact, Help, Privacy, Terms, Trust | Built (legal/about copy is draft) |
| 3. MVP platform flows (auth, dashboards, hiring pipeline, admin) | **Not built.** The data model is in `prisma/schema.prisma`; `/join` and `/login` are non-functional shells |
| Seed data | In `src/data/sample.ts` (all marked *Sample*). A DB seed script comes with phase 3 |

## Setup

```bash
cd kalwings
npm install
cp .env.example .env.local
npm run dev          # http://localhost:3000
npm run build && npm start
```

Node 20+.

## Where to replace placeholders

| What | Where |
| --- | --- |
| Impact numbers (`[X]+`) | `impact` in `src/data/sample.ts`: set `value` to a real number and it counts up. Never publish estimates. |
| Mentors, opportunities, challenge, stories, community groups | `src/data/sample.ts` |
| Ecosystem / partner / hiring-company logos | `src/components/home/trust-impact.tsx` (text wordmarks for now; use official greyscale SVGs, with permission) |
| Photos (mentors, students, events, founder) | Every `<PhotoPlaceholder />` (grep for it). Use `next/image` with real alt text |
| Awards & press | `Recognition` in `src/components/home/rest.tsx`: real, linkable entries only |
| Founder note | `Team` in `src/components/home/rest.tsx` (draft wording for Mohammed Sajeed Khan to edit) |
| Pricing | `tiers` in `src/app/employers/page.tsx` |
| Social links | `social` in `src/components/footer.tsx` |
| Legal text | `src/app/{privacy,terms,trust}/page.tsx`. **Have a lawyer review.** |
| Site URL / metadata | `NEXT_PUBLIC_SITE_URL`, `src/lib/site.ts`, `src/app/layout.tsx` |

Sample detail pages (`/mentors/[slug]`, `/opportunities/[id]`) are `noindex` and left out of the sitemap until real data replaces them.

## Design system

- Tokens: `tailwind.config.ts` (brand colours, radii, shadows) and CSS variables in `src/app/globals.css` (light/dark semantic colours).
- Components: `src/components/ui/` — `Button`, `Badge` / `SampleTag` / `PhotoPlaceholder`, `Reveal`, `CountUp`, `Marquee`, `Logo` / `WingMark` / `WingDivider`.
- Accessibility: white text on the teal→sky gradient fails WCAG AA, so primary buttons use **navy text** on the gradient. Teal as *text* on light backgrounds uses `teal-700` (`#0F766E`).
- Motion respects `prefers-reduced-motion` (CSS and Framer Motion).
- Dark mode: navbar toggle, saved in `localStorage`, defaults to the OS setting.

## Trust rules built into the UI

Pay, work mode, location and eligibility always shown · unpaid roles labelled · student contact private by default · no "guaranteed job" language · sponsored never styled as verified · no invented stats, awards, testimonials or logos.

## Platform roadmap (phase 3)

1. `npm i prisma @prisma/client`, set `DATABASE_URL`, `npx prisma migrate dev`, write a seed script from `src/data/sample.ts`.
2. Auth: Auth.js (Google + email/phone OTP); roles from the `Role` enum; middleware plus a role check inside **every** server action.
3. Student onboarding wizard, Talent Card (`/t/[slug]` + QR), application tracker.
4. Mentor and employer dashboards; employer verification gate; pipeline.
5. Admin queues + audit log.
6. Cross-cutting: Zod validation, rate limiting, CSRF (server actions + origin check), secure uploads (signed URLs, type/size limits), email, analytics, Sentry, PWA service worker (manifest already present).
7. Wire the Contact form; add OG images and `next/image` once real photos exist; run Lighthouse on real content.
