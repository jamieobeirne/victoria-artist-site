# Admin Panel — Test Spec

Companion to `admin-panel-build-plan.md`. Ordered by consequence: a failure in Group 1 or 2 destroys the site or the portfolio data; a failure in Group 6 is a papercut. Write these tests before the corresponding implementation exists, confirm each one fails for the *right* reason (not a typo, not a missing import), then implement until it passes.

Framework assumptions: Jest + Testing Library for unit/component tests (already in the project), route handlers tested directly by importing and invoking them, R2/Auth.js mocked at the module boundary — no live network calls in the test suite.

---

## Group 1 — Auth allowlist (fail-closed) [CRITICAL]

The signIn callback is the entire security boundary. Google authenticates any account; only the callback decides who's admitted.

1.1 — Unauthenticated request to `/admin` redirects to sign-in (not a 200, not a blank page).
1.2 — Unauthenticated request to any `/api/admin/*` route returns 401, not a redirect and not the route's normal response.
1.3 — `signIn` callback called with a non-allowlisted, verified Google profile returns `false`.
1.4 — `signIn` callback called with the allowlisted email but `email_verified: false` returns `false`.
1.5 — **Regression test for the fail-open bug**: `signIn` callback called with `process.env.ADMIN_EMAIL` unset (or empty string) returns `false` for *every* profile, including one matching what would otherwise be the admin email. This must fail loudly if someone ever "simplifies" the callback to `return !adminEmail || email === adminEmail`.
1.6 — `signIn` callback called with the allowlisted email, `email_verified: true`, and `ADMIN_EMAIL` set returns `true`.
1.7 — Email comparison is case-insensitive (`Victoriard6@Gmail.com` matches `victoriard6@gmail.com`) but not substring/prefix matching (`victoriard6@gmail.com.evil.com` must NOT match).

## Group 2 — Manifest integrity [CRITICAL]

Every write rewrites the whole file. A bug here doesn't corrupt one entry — it erases the portfolio.

2.1 — `readManifest()` given valid JSON returns the parsed object with both `trabajo` and `proyectos` arrays.
2.2 — `readManifest()` given corrupted/truncated/non-JSON content **throws** — does not return `{ trabajo: [], proyectos: [] }` or any other default.
2.3 — `writeManifest(next)` given a payload that fails zod validation (e.g. missing `id`, title >80 chars, empty `images`) does **not** call the R2 put — assert the mock upload function was never invoked.
2.4 — `writeManifest(next)` given a valid payload calls the R2 put exactly once, with both `trabajo` and `proyectos` present in the written body even if only one category changed.
2.5 — Simulate a write failure (mocked put rejects): assert nothing about the previously-read manifest is mutated in a way that would be re-read as authoritative — i.e. no local cache is updated to reflect the failed write.
2.6 — A create/update/delete operation for a `trabajo` entry never touches or drops any `proyectos` entries in the resulting written manifest, and vice versa.

## Group 3 — Upload / field validation [HIGH]

Shared zod schema — client and server must agree.

3.1 — Entry title of 81 chars is rejected by the schema; 80 chars is accepted.
3.2 — Entry description of 501 chars is rejected; 500 is accepted.
3.3 — Image caption of 151 chars is rejected; 150 is accepted.
3.4 — Entry with `images: []` is rejected (minimum 1 image).
3.5 — Non-image MIME type (e.g. `application/pdf`) is rejected before a presigned URL is requested/issued.
3.6 — File exceeding the configured size cap is rejected before a presigned URL is requested/issued.
3.7 — Same invalid input (e.g. 81-char title) run through the schema in a simulated "client" context and a simulated "server" context produces the identical validation error — proves there's one schema, not two definitions that can drift.
3.8 — Category must be exactly `'trabajo'` or `'proyectos'` — any other string rejected (proves "one category at a time per entry" is enforced, not just a UI default).

## Group 4 — Presigned URL / R2 flow [HIGH]

4.1 — Authenticated admin requesting a presigned URL receives a PUT URL scoped to a single, unique object key (not a prefix/wildcard).
4.2 — Presigned URL has a bounded TTL (e.g. ~5 min) — assert the expiry parameter passed to the presigner, not just that a URL string came back.
4.3 — Unauthenticated caller hitting `/api/admin/upload-url` gets 401 (route-specific re-check, distinct from the middleware-level test in 1.2).
4.4 — After a successful PUT (mocked), the object's public URL is constructed from `R2_PUBLIC_BASE_URL` + the same key used in the presign request — proves the client can't be given a URL that doesn't match what was actually uploaded.

## Group 5 — CRUD entry operations [MEDIUM]

5.1 — Creating an entry with `category: 'trabajo'` appends to `manifest.trabajo`, leaves `manifest.proyectos` untouched.
5.2 — Creating an entry with `category: 'proyectos'` appends to `manifest.proyectos`, leaves `manifest.trabajo` untouched.
5.3 — Editing an entry's title/description updates only those fields — `images` array is unchanged, `id` and `createdAt` are unchanged, `updatedAt` changes.
5.4 — Deleting one image from a 3-image entry leaves the other 2 images intact and in their original order; the entry itself is not removed.
5.5 — **Open decision, test assumes "block" pending Jamie's confirmation**: attempting to delete the last remaining image of an entry is rejected (entry must always have ≥1 image). If the decision changes to "delete last image deletes the whole entry," this test must be rewritten, not just re-pointed.
5.6 — Deleting an entry removes it from the manifest array entirely (not just marked hidden) and the response confirms which R2 keys should now be considered orphaned (for cleanup, even if cleanup itself isn't implemented yet).
5.7 — A newly created entry is present in the data the public `/home` page fetches (integration-level: create via API, then assert the fetch-manifest function used by `app/home/page.tsx` includes it).

## Group 6 — UI / UX polish [LOW]

6.1 — Character counter for title/description/caption updates on every keystroke and reflects the actual remaining count, not a stale value.
6.2 — Counter and submit button both reflect the invalid state when a field exceeds its cap (visually distinct counter, disabled submit) — not just server-side rejection after the fact.
6.3 — The category selector has no default selection; submit is disabled until the admin explicitly picks `trabajo` or `proyectos`.
6.4 — Dashboard renders a distinguishable empty state when a category has zero entries, and a loading state while the manifest fetch is in flight.

---

## Running order

Groups 1–2 first, always — nothing else matters if auth fails open or a write can nuke the manifest. Groups 3–4 before any UI is built (they're the server-side contract the UI depends on). Groups 5–6 last, once the underlying primitives are trustworthy.
