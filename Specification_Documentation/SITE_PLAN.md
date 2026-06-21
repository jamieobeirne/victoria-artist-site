# Victoria Artist Site — Project Plan

## Site Overview

A contemplative, minimalist portfolio site for a visual artist. The interface stays quiet and restrained so the drawings remain the primary focus at all times.

**Current live site:** https://jamieobeirne.github.io/victoria-artist-site/
**Repository:** https://github.com/jamieobeirne/victoria-artist-site

---

## Current State

- Static HTML site (5 pages: index, bio, statement, trabajo, proyectos, contacto)
- Hosted on GitHub Pages
- No backend, no CMS, no dynamic content
- Images are committed directly to the repository

---

## Design Principles

- Contemporary minimalist aesthetic
- Value-only palette: whites, greys, near-blacks (never pure black)
- Sans-serif typography at ~80–90% black
- No decorative UI that competes with the artwork
- Two-step entry: gateway image → content layer

---

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Entry gateway — one strong image, ENTER call to action |
| `bio.html` | Artist biography |
| `statement.html` | Artist statement |
| `trabajo.html` | Work / drawings gallery |
| `proyectos.html` | Projects gallery |
| `contacto.html` | Contact |

---

## Planned Migration: Next.js + Vercel Blob + Clerk

The site owner needs to upload and manage images herself without touching code. This requires a backend, which means migrating from the current static site to a Next.js application.

### Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend + Backend | Next.js | Unified frontend and API routes in one project |
| Image Storage | Vercel Blob | Native Vercel integration, automatic CDN, ~$0.02/GB |
| Authentication | Clerk | Zero-backend auth, free tier sufficient, real login UI |
| Hosting | Vercel | Seamless Next.js deployment, replaces GitHub Pages |

### How It Works for the Site Owner

1. Victoria visits `yoursite.com/admin` and logs in via Clerk
2. She uploads an image through a simple form
3. The image is stored in Vercel Blob and immediately appears on the gallery page
4. No code changes, no redeployment required

### Migration Steps

1. Scaffold Next.js project, port the 5 HTML pages to JSX
2. Port `styles.css` as-is
3. Set up Clerk auth and protect the `/admin` route with middleware
4. Build the `/admin` upload page (simple file input form)
5. Add an API route that receives the image and writes it to Vercel Blob
6. Update gallery pages to fetch and render images from Vercel Blob

**Estimated effort:** 3–5 days

---

## Content

- Artist has texts ready (bio, statement)
- Artist has image registros ready
- Current social presence: Instagram only

---

## Non-Goals (Current Phase)

- No multilingual content (defer decision)
- No advanced publishing workflow (draft/review/publish)
- No Instagram automation
- No exhibition or press database

---

## Open Questions

- What metadata is needed per image (title, year, series, medium, dimensions)?
- Should images be grouped into series, or is a flat gallery sufficient for now?
- Is a single admin user (Victoria) sufficient, or are multiple permission levels needed?
- Multilingual content (Spanish/English) — now or later?
