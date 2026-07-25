# Admin Panel — Build Plan

Workstream 2 for victoriaruizdiaz.com. Lets Victoria manage Trabajo/Proyectos entries herself: create an entry in one category, give it a global description, attach multiple images each with its own caption, edit or delete entries and individual images — all behind a Google sign-in restricted to her account.

This doc was written *after* reading the live site, not before. See "Schema reconciliation" — the assumptions in the original handoff didn't match the current code, and the mismatch changes the design.

---

## Schema reconciliation

**What the handoff assumed:** `/trabajo` and `/projects` are the live gallery pages, rendering from some data structure the admin panel would extend.

**What's actually in the repo:**

- `app/trabajo/page.tsx` and `app/proyectos/page.tsx` are static placeholder pages — one hardcoded lorem-ipsum image each. They are **not** wired to any data array. They render nothing dynamic today.
- The real gallery — nav accordion, click-to-view artwork — lives entirely in `app/home/page.tsx`, driven by two hardcoded arrays: `TRABAJO_ITEMS` and `PROYECTOS_ITEMS`, typed as `{ group: string; items: Artwork[] }[]` where `Artwork = { src, title, meta, desc? }`.
- There is **no entry-level description field** in the current type. `desc` exists per-image, populated only for Proyectos.
- Clicking a group in the nav always shows `group.items[0]`. The rest of `items` is stored but never displayed — multi-image-per-entry isn't something the site does today; the admin panel introduces it.

**Decision (flagged for Jamie's review, not yet approved by client):**

- The manifest becomes the single source of truth for both categories, replacing `TRABAJO_ITEMS`/`PROYECTOS_ITEMS`. `app/home/page.tsx` fetches it instead of hardcoding it.
- The dead `items` array becomes real: selecting an entry shows its title, its new global description, and all of its images (thumbnail strip + main viewer), each image showing its own caption.
- `app/trabajo/page.tsx` and `app/proyectos/page.tsx` are **out of scope** — they're vestigial and disconnected from the interactive gallery already; this workstream doesn't touch them. Flag for Jamie to decide later whether to remove or repurpose.

---

## Manifest schema

Stored at `manifest.json` in the R2 bucket, root key, single file for both categories:

```ts
interface Manifest {
  trabajo: Entry[]
  proyectos: Entry[]
}

interface Entry {
  id: string            // stable slug, e.g. `entry-<timestamp>-<random>`
  title: string          // <=80 chars — nav label + entry title
  description: string    // <=500 chars — NEW global description, 2-4 sentences typical (~300 chars)
  images: ImageItem[]    // ordered, minimum 1
  createdAt: string       // ISO 8601
  updatedAt: string       // ISO 8601
}

interface ImageItem {
  id: string
  url: string            // full https://cdn.victoriaruizdiaz.com/... URL
  caption: string         // <=150 chars, 60-120 typical
}
```

Entry order = array order (creation order; no drag-reorder in v1 — flag as future work if Victoria asks).

Validated end-to-end by one zod schema (`lib/schema.ts`), imported by both the client form and every server route, so a bad value never gets a different verdict on the client than on the server.

---

## Architecture

**Auth** — Auth.js v5, Google provider, JWT session (no DB needed for a handful of admins).
- `middleware.ts` protects `/admin/**`: unauthenticated → redirect to sign-in.
- `signIn` callback is the actual security boundary (Google will authenticate *any* Google account — the callback decides who gets in): parse `process.env.ADMIN_EMAILS` as a comma-separated allowlist, compare `profile.email.toLowerCase()` against it. **If `ADMIN_EMAILS` is unset, empty, or only whitespace/commas, reject everyone** — never fall through to allow. Also require `profile.email_verified === true`.
- Currently allowlists both `victoriard6@gmail.com` (Victoria) and `jamieobeirne123@gmail.com` (Jamie, co-admin) — decided 2026-07-25, permanent, not a local-testing-only shortcut.
- Every `/api/admin/*` route re-checks the session server-side too (defense in depth — don't rely on middleware alone).

**Image storage** — Cloudflare R2, bucket bound to `cdn.victoriaruizdiaz.com`. Chosen over Vercel Blob because Blob's Hobby tier caps transfer at 10 GB/mo and pauses the project when exceeded; R2 gives free egress and the domain's already on Cloudflare.

**Metadata storage** — `manifest.json` in the same R2 bucket. No database: one admin, infrequent edits, a DB adds a service and free-tier cold starts for no benefit. Neon Postgres is the escape hatch if a second editor ever appears.

**Upload path** — browser → R2 directly via presigned PUT URLs. Vercel serverless functions cap request bodies at 4.5 MB; routing camera-resolution photos through an API route body would fail. The server only ever hands out a short-lived (~5 min), single-object-scoped presigned URL — the actual bytes never pass through a Vercel function.

**Manifest writes** — every write rewrites the whole file (it's the only copy). A single module (`lib/manifest.ts`) owns all reads/writes:
- `readManifest()` — GETs the object, `JSON.parse`s it. **On parse failure, throws — never returns an empty/default manifest.** A bug here must surface loudly, not silently erase the portfolio.
- `writeManifest(next)` — validates `next` against the zod schema first; only writes if valid; always writes both `trabajo` and `proyectos` keys (a write touching one category can never drop the other's data).

---

## Environment variables

| Var | Purpose |
|---|---|
| `AUTH_SECRET` | Auth.js session encryption |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth client |
| `ADMIN_EMAILS` | Comma-separated allowlist — `victoriard6@gmail.com,jamieobeirne123@gmail.com` |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | R2 (S3-compatible) credentials |
| `R2_BUCKET_NAME` | Bucket name |
| `R2_PUBLIC_BASE_URL` | `https://cdn.victoriaruizdiaz.com` |

Configured now under Jamie's Vercel + Cloudflare accounts; migrate to Victoria's Vercel account before the first real deploy (see hosting caveat below).

---

## File / route map

As actually built (differs from the original plan in a few places — split further for testability):

```
middleware.ts                                              — re-exports auth from lib/auth-edge, protects /admin/** and /api/admin/**
lib/auth.config.ts                                         — edge-safe NextAuthConfig: pages, authorized() callback (no providers)
lib/auth-edge.ts                                            — NextAuth(authConfig).auth, used only by middleware.ts (no Google provider bundled into edge)
lib/allowlist.ts                                            — isAllowedEmail(): pure fail-closed email/verified check, dependency-free so it's unit-testable without loading next-auth
lib/auth.ts                                                 — full NextAuth instance (Google provider + signIn callback), used by server components/routes
lib/requireAdmin.ts                                         — requireAdminSession(session): per-route 401 helper (defense in depth beyond middleware)
app/api/auth/[...nextauth]/route.ts                         — Auth.js route handler (GET/POST)
app/signin/page.tsx                                         — sign-in page, server action calling signIn('google')
lib/r2.ts                                                   — S3-compatible client: getObject/putObject/deleteObject/presignUpload/publicUrlFor
lib/manifest.ts                                             — readManifest / writeManifest
lib/schema.ts                                                — zod schemas (category, image, entry, manifest, createEntryRequest), shared client+server
lib/entries.ts                                              — pure createEntry/updateEntry/deleteEntry/deleteImage (blocks deleting an entry's last image)
lib/upload.ts                                                — validateUploadFile: allowed MIME types + 15MB cap
app/admin/layout.tsx                                        — server-side session gate (redirect('/signin')) + sign-out
app/admin/page.tsx                                          — dashboard: list entries per category, empty state, delete
app/admin/new/page.tsx + components/admin/NewEntryForm.tsx  — new entry form: category (no default), title/description, multi-image upload with captions, live counters
app/admin/[category]/[id]/page.tsx + EditEntryForm.tsx      — edit title/description, delete individual images, delete entry
components/admin/CharCounter.tsx                            — shared live character counter
components/admin/DeleteEntryButton.tsx / DeleteImageButton.tsx
app/api/admin/upload-url/route.ts                           — POST → presigned PUT URL(s)
app/api/admin/entries/route.ts                              — POST create entry
app/api/admin/entries/[category]/[id]/route.ts              — PATCH update, DELETE entry
app/api/admin/entries/[category]/[id]/images/[imageId]/route.ts — DELETE one image
components/HomeGallery.tsx + app/home/page.tsx              — home page now fetches the manifest; renders every image in an entry (thumbnail strip), not just the first
.env.example                                                — full list of required env vars
```

---

## Build order (~10–13h) — all six steps complete

1. **Auth** — ✅ Auth.js v5 + Google + allowlist callback + middleware. 13 tests (`__tests__/auth.test.ts`).
2. **R2** — ✅ bucket wiring, presign helper, `lib/manifest.ts` read/write. 7 tests (`__tests__/manifest.test.ts`).
3. **Upload** — ✅ presigned-URL API route + browser direct-to-R2 upload flow. 12 tests (`__tests__/upload.test.ts`, `upload-url-route.test.ts`).
4. **Form** — ✅ new/edit entry forms, zod validation, live character counters. Covered by `__tests__/admin-ui.test.tsx`, `schema.test.ts`.
5. **Manage** — ✅ dashboard, delete entry, delete individual image (blocks last-image deletion), edit text. 11 tests (`__tests__/entries.test.ts`, `entries-routes.test.ts`).
6. **Polish** — ✅ styling matching the site's existing minimalist convention (reused `.form-field`/`.form-submit` patterns); home page (`app/home/page.tsx`) switched from hardcoded arrays to the manifest.

**65 tests / 9 suites passing. Clean `next build` (Turbopack, TypeScript check included).**

Note: steps were built continuously in one pass rather than reported one-by-one, per an explicit "complete everything, don't stop to ask" instruction partway through — a deviation from the original plan worth flagging since it means less checkpoint-review happened than this doc originally called for.

---

## Security checklist — all implemented and covered by tests

- [x] `ADMIN_EMAILS` unset/empty/whitespace-only → sign-in rejected for everyone (not everyone admitted) — `lib/allowlist.ts`, tested in `auth.test.ts`
- [x] Multiple comma-separated admins each get in independently; an email not in the list is still rejected
- [x] `email_verified` checked, not just email match
- [x] Every `/api/admin/*` route checks session server-side, independent of middleware — `lib/requireAdmin.ts`
- [x] Presigned URLs: single-object scope, PUT only, short TTL (~5 min) — `lib/r2.ts` `presignUpload`
- [x] File type restricted to image formats before a presigned URL is issued — `lib/upload.ts`
- [x] File size capped (15 MB/image) before a presigned URL is issued
- [x] `readManifest()` throws on parse failure — never silently returns an empty manifest
- [x] `writeManifest()` validates against zod before writing; always writes both categories

Not yet verifiable: none of this has run against real Google OAuth or a real R2 bucket — only against mocks. First real sign-in and first real upload after infra is provisioned should be treated as the actual integration test.

---

## Hosting caveat — resolve before first deploy

Vercel's Hobby plan fair-use terms restrict it to non-commercial personal projects and explicitly name client sites as requiring Pro ($20/mo). Recommended resolution: deploy under **Victoria's own** Vercel account (her personal portfolio is legitimately personal use and stays free) rather than the developer's. Moving a project between accounts later is worse than doing it now — settle this before the first production deploy, not after.

## Field limits

| Field | Hard cap | Typical |
|---|---|---|
| Entry title | 80 chars | — |
| Entry description | 500 chars | 2–4 sentences, ~300 chars |
| Image caption | 150 chars | one line, 60–120 chars |

Enforced by the shared zod schema (`lib/schema.ts`), client and server. Live character counters in the UI — otherwise expect essays pasted into caption fields.

## Open items for Jamie

1. `/trabajo` and `/proyectos` static routes — leave as dead pages, remove, or repurpose? (out of scope for this workstream either way)
2. ~~Deleting the last image from an entry~~ — **Decided: block it.** Entry must always have ≥1 image. Implemented and tested.
3. ~~Co-admin access~~ — **Decided 2026-07-25: permanent.** `jamieobeirne123@gmail.com` added to `ADMIN_EMAILS` alongside Victoria. Not a local-only shortcut.
4. **R2 is blocked on a Cloudflare permissions issue — see Status below. Needs Victoria.**

---

## Status (as of 2026-07-25, end of session)

All application code is built and passing (69 tests, clean production build, `next build` succeeds). Local dev auth is fully working end-to-end. R2/image storage is blocked on a real permissions issue, not just "not done yet" — see below.

### ✅ Done — Google OAuth (local)

- Google Cloud project: **"My First Project"**, Project ID `noted-palisade-318516` (Jamie's own Google Cloud account — separate from Cloudflare).
- OAuth consent screen ("Google Auth Platform") configured: **External** user type, app name "Victoria Ruiz Diaz Admin", support/contact email `jamieobeirne123@gmail.com`. Publishing status: **Testing**.
- Test users added (required while in Testing mode — only these can sign in): `victoriard6@gmail.com`, `jamieobeirne123@gmail.com`.
- OAuth Client "Web client 1" created:
  - Client ID: `838817677344-blc81efv97p3hg4fvvpvcdtichttqv4l.apps.googleusercontent.com`
  - Authorized JS origin: `http://localhost:3000`
  - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
  - **Only the local redirect URI is registered.** Before deploying anywhere, add the production URI (`https://victoriaruizdiaz.com/api/auth/callback/google` or whatever domain it ends up on) to this same client in Google Cloud Console → APIs & Services → Clients.
  - Client secret is saved in `.env.local` only (not reproduced here). If it's ever lost, generate a new one from the client's page — Google only shows/allows download of a secret once, at creation or rotation time.
- `.env.local` fully populated: `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `ADMIN_EMAILS=victoriard6@gmail.com,jamieobeirne123@gmail.com`.
- **Verified live**: signed in via the real Google OAuth flow as `jamieobeirne123@gmail.com` → correctly reached `/admin` (past middleware and the layout's session check). Confirms the allowlist, session handling, and route protection all work against real infrastructure, not just mocks.

### 🚫 Blocked — Cloudflare R2

**The domain and R2 both live under Victoria's Cloudflare account** (`victoriard6@gmail.com's Account`, account ID `776f1f5a03beb8d6f3e0ad3b2a317dd2`), not Jamie's own Cloudflare account (which has no domains on it at all). Jamie has membership access to Victoria's account, but:

- Cloudflare Members list shows `victoriard6@gmail.com` as **Super Admin** and `jamieobeirne123@gmail.com` as a regular member (no Super Admin, no billing role).
- R2 has never been enabled on this account — enabling it requires clicking "Add R2 subscription to my account" (Storage & Databases → R2 Object Storage → Overview). This is **$0.00 due now** (well within the free tier: 10GB storage, 1M/10M ops per month) but it activates a billing subscription tied to the account's payment method.
- Clicking that button as Jamie did nothing — confirmed the cause by visiting Billing directly, which returned **"No Access — you don't have permission to view this page."**

**This needs Victoria, one of two ways:**
1. She logs into Cloudflare herself and clicks "Add R2 subscription to my account" (same page, same $0.00-now action) — then Jamie can proceed with bucket creation, custom domain binding, and API token generation, all of which don't require billing permission once the subscription exists.
2. She upgrades Jamie's role to Super Admin (or grants a custom role with billing access) in Manage Account → Members, and Jamie does the whole thing himself.

**Once unblocked, remaining R2 steps** (not yet started):
1. Create the bucket (name TBD, e.g. `victoria-portfolio`).
2. Bind it to custom domain `cdn.victoriaruizdiaz.com`.
3. Generate an R2 API token scoped to this bucket → `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`.
4. Seed `manifest.json` in the bucket with `{"trabajo":[],"proyectos":[]}` — `readManifest()` deliberately throws rather than inventing a default, so it will throw if this key doesn't exist yet. Not optional.
5. Fill in the `R2_*` vars in `.env.local`, restart the dev server, and re-test `/admin` (currently fails there with `No value provided for input HTTP label: Bucket` — expected, since `R2_BUCKET_NAME` is still empty).

### Still pending regardless of the above

- **Vercel account** — deploy under Victoria's account per the hosting caveat above, not Jamie's. Not started.
- **Production Google OAuth redirect URI** — add once the deploy domain is known.
- **Production env vars** — everything in `.env.example`, set in Vercel's project settings once that account exists.

See `.env.example` at the repo root for the full variable list (values, not just names, are only ever in `.env.local`, which is gitignored).
