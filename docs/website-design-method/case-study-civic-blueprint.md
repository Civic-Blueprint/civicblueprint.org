# Case Study — civicblueprint.org

The worked example the method was extracted from. For each phase: the question
that forced the decision, the decision, and where it landed in the repo. Read
this when an abstract instruction in a phase guide isn't clicking.

**Source artifacts:** `docs/WEBSITE_PHASE_1_BRIEF.md`,
`docs/HOMEPAGE_UX_FIRST_PASS.md`, `docs/HOMEPAGE_DESIGN_SYSTEM_SPEC.md`,
`docs/HOMEPAGE_COPY_DRAFT.md`, `docs/HOMEPAGE_COPY_DRAFT_PHASE_2.md`,
`docs/WEBSITE_PHASE_2_BRIEF.md`, and the shipped code under `website/`.

---

## Phase 1

_Source: `docs/WEBSITE_PHASE_1_BRIEF.md`._

| Question | Civic Blueprint's answer |
|----------|--------------------------|
| What is it / what does it do? | An open project for thinking seriously about how key systems fail and might be redesigned — with a substantial draft framework that needs external challenge. |
| What's the narrowed goal for v1? | _"The smallest credible website that helps Civic Blueprint move from internal document development to external challenge."_ Not a public platform. |
| First right audience? | Civic technologists, public-interest product/ops people, public-administration researchers, policy-adjacent builders, domain experts who can challenge specific claims. |
| Explicitly NOT for? | "Everyone," broad social traffic, people looking for a movement to join before understanding the work. |
| Single action? | Read the first proof-of-usefulness memo. |
| Posture? | _"Here's a claim. Test it."_ — challenge, not applause. |
| Success criteria? | Qualitative first: a few serious readers send specific critique; a domain expert surfaces a weak claim; the memo reveals a place the framework needs revision. |

**Product principles set here:** plain language at the entry point, scannable
writing, objective tone, accessibility from the start, "challenge, not
applause." These five became the standard every later phase was checked against.

**The deferral list that let it ship:** no multilingual support, no interactive
graph, no public wiki, no multiple case studies, no general community platform,
no polished visual identity system at launch.

---

## Phase 2

_Source: `docs/HOMEPAGE_UX_FIRST_PASS.md`._

**The single objective that organized everything:**
_"Get someone from curious → reading the memo in under 60 seconds. Everything
else is secondary."_

**The decision funnel (the three layers):**

- Layer 1 (5–10s): what is this + why should I care?
- Layer 2 (15–30s): is this worth my time?
- Layer 3 (30–60s): OK, I'll read the memo.

**Layering, not flattening** — four depth layers so a non-expert and a
specialist are both served: intuitive → conceptual → technical → contribution.
The governing line: _"The core ideas should remain rigorous. The interface
should become human."_

**Homepage section flow (Phase 1):** Hero → Quick context strip →
Why this exists → The shift / core claim → Memo 01 conversion →
Framework overview → Why this site exists → What input is useful →
How to respond → Closing.

**IA (five page types):** Home, Start Here, Proof-of-Usefulness, Read the
Framework, Challenge or Contribute. Top nav: Start Here / Memo / Framework /
Contribute.

**Hero spec:** eyebrow ("An open analytical project"), a question headline,
finding subhead, a posture line, and CTAs in priority order. Shipped in
`website/src/components/Hero.tsx`.

---

## Phase 3

_Source: `docs/HOMEPAGE_DESIGN_SYSTEM_SPEC.md`; shipped in
`website/src/app/globals.css` and `website/tailwind.config.ts`._

**The anchor rule:** _"The website should adapt to the logo, not the other way
around."_ The logo's drafting/blueprint language became the entire system.

**Feeling words:** precise, public, enduring, structurally thoughtful, measured-
optimistic. **Anti-references:** startup gradients, glassmorphism, AI-futurist
glow, campaign visuals, nonprofit softness, generic policy-blog design.

**Color tokens (as shipped):**

| Token | Hex | Role |
|-------|-----|------|
| Blueprint Navy | `#123E7C` | primary — CTAs, links, active nav, emphasis |
| Technical Blue | `#2B5A96` | secondary — hover, borders, accents |
| Drafting Surface | `#F7F4EF` | warm paper page background |
| Drafting Line Gray-Blue | `#C7D2E3` | dividers, grid, card outlines |
| Ink | `#111827` | body text |
| Slate | `#334155` | secondary text |
| Muted | `#64748B` | metadata, helper text |
| Soft | `#E5E7EB` | subtle borders |

**Typography:** Public Sans (body/UI) + Source Serif 4 (display/headlines),
loaded via `next/font/google`. Fluid scale via `clamp()` steps `--step--1`
through `--step-4`.

**Layout:** 1280px shell (`.container-shell`), 70ch reading width
(`.reading-width`), generous section rhythm with a thin structural top border
(`.section-shell`).

**Components / motif:** `.blueprint-card`, `.blueprint-panel`, `.primary-button`,
`.secondary-button`, `.text-link`, plus the signature motifs `.blueprint-grid`
(36px faint grid at ~35% opacity) and `.corner-marks` (crop marks on the
featured panel). Explicit `:focus-visible` outlines on all interactive elements.

**Imagery policy:** almost none — no stock photos. Identity comes from structure,
type, and layout.

---

## Phase 4

_Source: `docs/HOMEPAGE_COPY_DRAFT.md` (Phase 1) and
`docs/HOMEPAGE_COPY_DRAFT_PHASE_2.md` (Phase 2); shipped across
`website/src/components/`._

**Voice rules:** lead with the conclusion; short scannable sections; concrete
over conceptual; no promotional copy; outbound links for credibility; tell the
reader exactly what's wanted.

**Hero copy (Phase 2, shipped):** headline _"What if we're not as divided as we
think?"_; subhead on convergence; posture line _"a working thesis backed by
evidence, not a settled claim."_

**Featured-proof copy as a mini product page:** the memo panel
(`MemoFeature.tsx`) carries a title, a "why this matters" paragraph, an explicit
"Key test questions" list, and the honesty line that if the framework adds
nothing "the project needs to know that."

**Provenance:** the four-value standard (`human`, `collaborative`,
`ai-generated, steward-curated`, `ai-generated`) surfaced on the page — the hero
links to content-provenance labels and the memo panel shows a `collaborative`
pill.

**Meta/social:** page title _"Civic Blueprint | What if we already agree on
where we're going?"_ plus OG/Twitter cards, set in
`website/src/app/layout.tsx`.

---

## Phase 5

_Source: `README.md`, `infrastructure/`, and `website/` config._

**Stack (from Phase 1 criteria — fast, low-maintenance, accessible, hostable,
reading-friendly):** static Next.js export (`output: "export"` in
`next.config.ts`) → S3 + CloudFront. Pagefind builds a static search index
(`postbuild`). The one dynamic need (non-GitHub contribution form) is an API
Gateway + Lambda endpoint, so the site itself stays static.

**Tokens, one home:** CSS custom properties in `globals.css`, mirrored into the
Tailwind theme; components reference named classes, not raw hex.

**Fonts:** `next/font/google`, self-hosted at build time (no layout shift, no
blocking third-party request).

**Validation:** `npm run build` is a hard gate; Playwright visual snapshots
(`npm run test:e2e`); accessibility baked in (semantic HTML, keyboard nav,
`:focus-visible` outlines, contrast, mobile tap targets).

**Ops:** OIDC-based CI/CD (PR → staging, merge → production with approval);
staging is `noindex` + `robots` disallow; production ships `sitemap.xml`,
`robots.txt`, a branded OG image, and JSON-LD.

---

## Phase 6

_Source: `docs/WEBSITE_PHASE_2_BRIEF.md`._

A real repositioning that kept the machine and changed the argument.

- **Narrative arc:** "problem → principles → proposals" → "shared aspiration →
  alignment evidence → principles as outcome targets → proposals as realignment."

**Keep / reframe / replace:**

| Bucket | What |
|--------|------|
| **Keep** | Visual identity & design system, component architecture (panels, cards, grids, corner marks, typography), challenge-oriented tone, contribution paths, proof-of-usefulness artifact, epistemic posture, technical stack. |
| **Reframe** | Principles re-introduced as "shared outcome targets" (no content change); Problem Map as a "drift diagnostic"; Systems Framework as "realignment analysis"; new hero + framing copy; reordered homepage. |
| **Replace / add** | "Why This Exists" gave way to "The Finding" + "The Gap"; a new "Evidence" page for the formation-document corpus; expanded contribution input types. |

**Discipline observed:** the previous (Phase 1) site was to be archived at a
public URL before Phase 2 shipped, preserving rollback and comparison. The same
`Hero`, `.blueprint-panel`, and font pairing now carried a different thesis —
zero rebuild.

---

## The throughline

Every visible choice — the serif headline, the warm paper background, the faint
grid, the "test this claim" posture, the static stack — is traceable to an answer
given in an earlier phase. That traceability is what the method protects and what
a drag-and-drop CMS cannot give you.
