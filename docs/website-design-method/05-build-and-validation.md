# Phase 5 — Build & Validation

**Question this phase answers:** _How do we ship the design accessibly, with the
tokens as the single source of truth, and prove it works?_

**Artifact produced:** a deployed site and a passing validation suite.

**Exit criteria:** the build passes, the design tokens live in exactly one
place, the accessibility checklist is met, and a real person completed the
single action without help.

---

## Why this phase exists

By now the hard thinking is done. Build is largely **transcription** of Phases
1–4 into code — but transcription has its own failure modes (tokens drift,
accessibility gets skipped "for now," nobody tests the thing on a phone). This
phase exists to make the build faithful and to prove the result, rather than
assume it.

## Principle: the content shape chooses the stack

Don't pick a stack by fashion; pick it from the Phase 1 technical selection
criteria. Civic Blueprint's were: **fast to ship, low maintenance, accessible by
default, easy to host, good at long-form reading.** Those criteria pointed to a
static site, and the implementation is a **static Next.js export** (`output:
"export"`) deployed to **S3 + CloudFront**, with a small serverless function for
the one dynamic need (the contribution form). Search is a build-time index
(Pagefind) so it works on static hosting with no backend.

The lesson is not "use Next.js." It's "let the content shape decide." A
long-form, mostly-static, reading-heavy site wants a static generator. A
data-heavy app wants something else. Choose for the criteria, then commit.

## Principle: tokens have one home

Every value from Phase 3 should live in exactly one place and be referenced
everywhere. In this build that's CSS custom properties in `globals.css`,
mirrored into the Tailwind theme so utilities and hand-written CSS agree:

```css
@theme inline {
  --color-blueprint-navy: #123e7c;
  --color-blueprint-technical: #2b5a96;
  --color-blueprint-surface: #f7f4ef;
  --color-blueprint-line: #c7d2e3;
  --font-sans: var(--font-public-sans);
  --font-display: var(--font-source-serif);
}
```

Reusable surfaces become named classes (`.blueprint-card`, `.blueprint-panel`,
`.primary-button`, `.corner-marks`, `.blueprint-grid`) so the motif and
components are applied, not re-invented per page. Fonts are loaded once, the
right way for the framework (here, `next/font/google` for Public Sans + Source
Serif 4, self-hosted at build time — no layout shift, no third-party request).

When a color needs to change, you change one line. That is the difference
between a design system and a pile of inline styles.

## Principle: accessibility is built in, not bolted on

The Phase 1 brief committed to accessibility from the start, so the build
honors it rather than retrofitting:

- semantic HTML (real headings, landmarks, lists)
- keyboard-accessible navigation and visible focus states (the shipped CSS
  defines explicit `:focus-visible` outlines on every interactive element)
- alt text on meaningful images
- text contrast ≥ 4.5:1
- mobile-friendly layouts and tap targets (buttons have a min height ~2.75–3rem)
- readable type sizes and a fluid scale

Retrofitting accessibility costs more than building it in and usually ships
broken anyway. Treat the checklist as a launch gate.

## Principle: prove it, don't assume it

Validation on this project includes:

- **Build must pass.** `npm run build` produces the static export; a broken
  build never ships. (Run the nearest `package.json` build before considering
  any code change done.)
- **Visual snapshots.** Playwright captures the rendered pages so unintended
  visual changes are caught in review (`npm run test:e2e`, update with
  `:update`).
- **A manual keyboard pass.** Tab through the page; can you reach and trigger the
  single action with no mouse?
- **A real-device check.** Open it on an actual phone, not just a resized
  browser.
- **One real-human walk-through.** Watch someone from the target audience try to
  do the single action. This finds more than any automated test.

## Deployment & operational decisions to make

- **Hosting + CDN** that matches the stack (static → object storage + CDN).
- **CI/CD**: build on PR to a staging environment, promote to production on
  merge, with production gated by an approval. Keep secrets out of the repo (use
  OIDC / environment secrets).
- **Staging hygiene**: keep staging out of search indexes (`robots.txt`
  disallow, `noindex` header) so the unfinished site doesn't get crawled.
- **SEO & social**: real `sitemap.xml`, `robots.txt`, a branded 1200×630 OG
  image, per-page Open Graph/Twitter metadata, and structured data
  (Organization, Article/BreadcrumbList JSON-LD) where it helps.
- **Analytics & privacy**: if you measure, do it with consent and a clear
  policy. Measure the single action, not vanity metrics.

## The questions to ask

- Which Phase 1 criteria does the stack need to satisfy, and what's the simplest
  stack that does?
- Where is the single source of truth for tokens?
- Are fonts loaded the framework-native way (no layout shift, no third-party
  blocking request)?
- Is every interactive element keyboard-reachable with a visible focus state?
- Does every text/background pair pass contrast?
- What's the validation suite, and is the build a hard gate?
- What's the deploy pipeline, and are secrets kept out of the repo?
- What's the minimum SEO/social setup for launch?

## Common traps

- **Tokens drift.** Hardcoded hex values scattered through components instead of
  referencing the theme. The first redesign becomes a search-and-replace
  nightmare.
- **"We'll do a11y later."** Later means never, and retrofits are worse.
- **Third-party font flash.** Render-blocking font requests and layout shift;
  load fonts the framework-native way.
- **No real-device test.** "Looks fine in my browser" is not mobile testing.
- **Shipping without a human walk-through.** Automated tests confirm it renders;
  only a person confirms it _works_.
- **Indexable staging.** Search engines crawl your half-built site.

## What "done" looks like

The site is deployed, the build is green, tokens live in one place, the a11y
checklist passes, and a real visitor completed the single action. If the
business/thesis later changes, you do **not** start over — go to
[Phase 6: Repositioning without rebuild](./06-repositioning-without-rebuild.md).

> Worked example: the Civic Blueprint stack, token wiring, and validation setup
> as shipped are in the [case study](./case-study-civic-blueprint.md#phase-5).
