# ANIKA TRADING & CO. — Website

Next.js 16 + TypeScript + Tailwind CSS v4 + Framer Motion.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build: `npm run build && npm start`.

Requires internet access on first `npm run build`/`npm run dev` so Next.js can
fetch the Google Fonts (Inter, Bricolage Grotesque) used in `src/app/layout.tsx`.

## What's built

| Route | Status |
|---|---|
| `/` | Done — cinematic scroll-driven homepage |
| `/about` | Done |
| `/business` | Done |
| `/projects` and `/projects/[slug]` | Done |
| `/export` | Done |
| `/export/products` and `/export/products/[slug]` | Done |
| `/contact` | Done (form submission is mocked — see below) |
| `/team`, `/partners`, `/gallery`, `/news`, `/downloads` | **Not built yet** |

## Content that needs real information

Search the codebase for these markers and replace with official company info:

- `src/data/site.ts` — head office address, phone, email are placeholders. WhatsApp
  number was provided as `+61 469 024 249`; confirm this is correct before launch.
- `src/data/projects.ts` — `[Year to be confirmed]` on every project.
- `src/data/export.ts` — MOQ, packaging, shelf life, and other spec fields marked
  `[Details available upon request]` / `[MOQ available upon request]`.
- No government clients, contract values, certifications, or statistics were
  invented anywhere — those are intentionally absent until you provide them.

## Contact form

`src/components/contact/ContactForm.tsx` currently mocks submission with a
1.2s delay and always succeeds. To wire it up for real:

1. Create `src/app/api/inquiries/route.ts` (a `POST` handler) that emails you,
   writes to a database, or forwards to a CRM.
2. In `ContactForm.tsx`, replace the `setTimeout` mock inside `handleSubmit`
   with a `fetch("/api/inquiries", { method: "POST", body: ... })` call, and
   set `status` to `"error"` on failure.

## Structure

```
src/
├── app/                  routes (App Router)
├── components/
│   ├── layout/           Navbar, Footer
│   ├── home/             homepage sections
│   ├── about/            about page sections
│   ├── business/         business page sections
│   ├── projects/         projects listing
│   ├── export/           export + product catalogue sections
│   ├── contact/          contact form
│   └── ui/               shared PageIntro, Reveal
├── data/                 all content, separated from UI
└── lib/                  cn() helper, scroll hooks
public/images/            optimized JPEGs from your image archive
```

## Design system

- Colors: `--color-navy` (#1F3488), `--color-teal`, `--color-violet`, brand
  gradient utilities (`.brand-gradient-text`, `.brand-gradient-bg`,
  `.brand-gradient-line`) — all defined in `src/app/globals.css`.
- Fonts: Bricolage Grotesque for display/headings, Inter for body.
- `prefers-reduced-motion` is respected globally (see `globals.css`).
- Scroll-driven sections (`SectorStory`, `BusinessShowcase`, `WhyAnika`,
  `CompanyTimeline`) use a shared `useStickyIndex` hook and shorten their
  scroll distance on mobile via `useIsDesktop` rather than just shrinking the
  desktop layout.

## Next steps

The two most useful additions from here: a real backend for the contact/RFQ
forms, and the remaining inner pages (Team, Partners, Gallery, News,
Downloads) — happy to keep building those in a follow-up.
