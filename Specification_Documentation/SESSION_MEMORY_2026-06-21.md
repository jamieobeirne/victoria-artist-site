# Session Memory — 2026-06-21

## Summary
Fixed critical navigation bugs on the Next.js site, completed responsive polish, removed the Next.js dev badge, and deployed the site live to Vercel.

---

## Problems Fixed

### 1. Inicio & Victoria Name Links Not Working on Trabajo / Proyectos
**Root cause:** The `/trabajo` and `/proyectos` pages had custom inline sidebar code that diverged from the shared `Sidebar` component. This caused inconsistent behavior.

**Fix:** Replaced the entire inline sidebar on both pages with `InnerLayout` → `Sidebar`, the same pattern used by bio, statement, and contacto (where links already worked). Both pages now render a static artwork image with full shared navigation.

### 2. Inicio / Victoria Name Appearing Broken on `/home` After Selecting Artwork
**Root cause:** Clicking a Trabajo/Proyectos child link on `/home` uses `href="#"` + `e.preventDefault()` to update artwork state without changing the URL. Clicking Inicio (also `href="/home"`) while already on `/home` produced no visible change, making it look broken.

**Fix:** Added `onClick={() => setActiveArtwork(null)}` to both the Inicio link and the Victoria name link on the `/home` page. Now clicking either resets the artwork viewer back to the default image, giving clear visual feedback.

---

## Responsive Audit

Used Playwright to screenshot all 7 pages at 3 viewport sizes (desktop 1440, tablet 768, mobile 390).

**Findings:**
- Mobile: single-column stacking worked correctly across all pages
- Tablet: two-column grid held, sidebar readable
- Desktop: layout solid; artwork display correct with placeholder images
- All pages: Next.js "N" dev badge visible — removed (see below)
- Bio/Statement/Contacto desktop: large empty space below content due to forced `min-height: 100vh`

**CSS fixes applied (`globals.css`):**
- `devIndicators: false` in `next.config.ts` — removes the Next.js badge in dev mode
- `.content-sidebar` changed to `position: sticky; top: 20px` — sidebar stays visible while scrolling
- Removed `min-height: calc(100vh - 40px)` from `.content-shell` — pages now size to their content
- Mobile: `artwork-display img` capped at `max-height: 70vw` — image doesn't dominate the viewport
- Tablet: sidebar column tightened from `220px` to `200px`
- Mobile: sidebar changed to `position: static` (overrides sticky)

---

## Deployment

- **Platform:** Vercel (replacing GitHub Pages — GitHub Pages cannot run Next.js)
- **CLI used:** `vercel --prod --yes`
- **Live URL:** https://victoriaruizdiaz.vercel.app
- **Auto-deploy:** Every `git push` to `main` triggers a new production deploy automatically
- **Account:** jamieobeirne123-7423s-projects on vercel.com
- **GitHub repo connected:** https://github.com/jamieobeirne/victoria-artist-site

---

## Commits This Session

| Hash | Description |
|------|-------------|
| `0ab1b12` | Fix nav links on Trabajo & Proyectos — use shared Sidebar via InnerLayout |
| `d880f01` | Reset artwork state when Inicio/name clicked while already on /home |
| `9c14734` | Responsive polish: remove dev badge, sticky sidebar, mobile artwork cap |
| `5b35a7a` | Replace Next.js favicon with V initial icon via next/og |
| `68bf82a` | Remove Next.js icon from browser tab — empty SVG favicon, no icon shown |

---

## Current Site Architecture

```
app/
  page.tsx           — Gateway (/) — server component, full-screen image + Entrar button
  home/page.tsx      — Content home (/home) — client component, artwork viewer + full nav
  trabajo/page.tsx   — Uses InnerLayout + Sidebar, static placeholder artwork
  proyectos/page.tsx — Uses InnerLayout + Sidebar, static placeholder artwork
  bio/page.tsx       — Uses InnerLayout + Sidebar
  statement/page.tsx — Uses InnerLayout + Sidebar
  contacto/page.tsx  — Uses InnerLayout + Sidebar

components/
  Sidebar.tsx        — Shared nav: Victoria name → /home, Inicio → /home, T/P accordions, etc.
  InnerLayout.tsx    — Wraps Sidebar + page content in two-column grid

app/globals.css      — All site CSS (Tailwind v4 + custom)
```

---

## Open / Next Steps

- [ ] Replace Lorem ipsum content with real artwork data (titles, dates, media, images)
- [ ] Set up Vercel Blob for image storage
- [ ] Set up Clerk for admin authentication
- [ ] Build `/admin` upload page so Victoria can upload images herself
- [ ] Optionally set a custom domain (e.g. victoriaruizdiaz.com.ar) in Vercel → Settings → Domains
