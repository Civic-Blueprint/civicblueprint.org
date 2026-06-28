# Phase 3 — Visual Identity & Design System

**Question this phase answers:** _What does this project feel like — and what are
the concrete rules (color, type, layout, components, motif) that produce that
feeling consistently?_

**Artifact produced:** a design system spec with real tokens.

**Exit criteria:** a developer who has never spoken to you could build a
consistent page from the spec alone. Every value is decided, not "TBD."

---

## Why this phase exists

This is where "what we believe" becomes "what it looks like." It is the phase
people _want_ to start with — and the reason so many sites are beautiful and
wrong. By placing it third, every aesthetic choice is forced to justify itself
against the brief and the UX. The serif headline isn't there because serifs are
nice; it's there because the brief asked for "enduring" and "editorial
seriousness."

A design system is not a brand book. It's the **minimum set of reusable
decisions** needed to ship consistently. Resist the urge to over-produce it.

## Principle: anchor, then adapt

The single most important move Civic Blueprint made was a rule:

> **The website should adapt to the logo, not the other way around.**

The logo already encoded precision, drafting language, infrastructure, and quiet
seriousness. Rather than invent an identity, the team _read_ the one that
already existed and let it govern color, type, and motif. Find your anchor first:

- an existing logo or mark
- a single controlling metaphor (blueprint, ledger, field notebook, transit map)
- a material or place
- one sentence of posture from Phase 1

Then derive everything from it. Derived systems are coherent; assembled-from-
Pinterest systems are not.

## How to decide colors

Civic Blueprint's color reasoning, generalized into a procedure:

1. **Start from the anchor's feeling, not a palette generator.** "Blueprint" →
   deep architectural blue on warm paper. The feeling chose the family.
2. **Pick one primary and use it sparingly but confidently.** Blueprint Navy
   `#123E7C` carries CTAs, links, active states, key emphasis — and nothing
   else. Saturation everywhere reads as noise.
3. **Add one secondary for support/hover**, close to the primary so it reads as
   the same voice: Technical Blue `#2B5A96`.
4. **Choose a background that does emotional work.** A warm "paper / drafting
   surface" `#F7F4EF` instead of stark white signals craft and calm. The
   background is a decision, not a default.
5. **Add a structural line color** for dividers, grids, card outlines: Drafting
   Line Gray-Blue `#C7D2E3`. This is what makes a site feel "engineered."
6. **Keep a disciplined neutral ramp** for text: Ink `#111827`, Slate `#334155`,
   Muted `#64748B`, Soft line `#E5E7EB`, White `#FFFFFF`.

**Rules that traveled well:** use the accent sparingly; no bright "tech" colors;
no gratuitous gradients; let whitespace and the warm surface do the work; always
verify text contrast ≥ 4.5:1.

## How to decide typography

The question to ask is _"what should this feel like to read?"_ — then choose
type that earns it.

- Civic Blueprint wanted **public, readable, durable, slightly architectural**,
  so it paired **Public Sans** (body/UI — civic-infrastructure connotation,
  excellent readability) with **Source Serif 4** (display/headlines — editorial
  warmth and longevity).
- A serif headline over a sans body buys "enduring/editorial" without
  sacrificing UI legibility. An all-sans system is also valid if your feeling
  words are "neutral, modern, engineered" — then create hierarchy with
  weight/size/spacing instead of a second family.
- Build a **fluid type scale** so headings breathe on large screens and stay
  readable on phones. The shipped scale uses CSS `clamp()` steps:

  ```css
  --step--1: clamp(0.86rem, 0.82rem + 0.2vw, 0.95rem);
  --step-0:  clamp(1rem,    0.95rem + 0.25vw, 1.125rem);
  --step-1:  clamp(1.2rem,  1.05rem + 0.6vw,  1.45rem);
  --step-2:  clamp(1.5rem,  1.2rem  + 1.1vw,  2rem);
  --step-3:  clamp(2rem,    1.4rem  + 2vw,    3rem);
  --step-4:  clamp(2.4rem,  1.5rem  + 3vw,    3.85rem);
  ```

**Rules that traveled well:** comfortable line lengths; create hierarchy with
weight and scale, not decoration; let headings breathe; avoid fragile/over-
elegant serifs; don't compress dense content.

## How to decide layout

The intent was _"engineered, not ornamental."_ That resolves to concrete values:

- Max content width ~1200–1280px (`.container-shell` uses 1280px).
- Long-form reading width 65–75ch (`.reading-width` uses 70ch).
- Generous vertical rhythm (`.section-shell` ~4.5–5.75rem top/bottom), with a
  thin structural top border between sections so the grid is felt, not seen.
- A small number of section patterns: centered single column, two-column
  explanatory, card grid, featured panel. Reuse them; don't invent per section.

> Whitespace is part of the trust signal. Do not over-compress.

## How to decide components

Decide the handful of reusable surfaces, once:

- **Cards** are "structured information panels," not SaaS feature boxes: subtle
  border (`#C7D2E3`), modest radius (~0.85rem), barely-there shadow, strong
  internal spacing.
- **Primary button**: filled primary color, white text, ~0.65rem radius,
  semibold, hover → secondary color. Use it rarely.
- **Secondary button**: transparent with primary border/text, lower weight.
- **Links**: editorial — primary color, underline on hover, no "cheap app"
  effects.
- **Interaction**: restrained, crisp, immediate. No bounce, glow, or aggressive
  transforms. Visible focus rings always.

## The signature motif (optional, high-leverage)

Borrowing one subtle, repeatable element from the anchor is what separates a
"clean" site from one with identity. Civic Blueprint used:

- a **faint blueprint grid** behind the hero and featured panel (`.blueprint-grid`,
  36px lines at ~35% opacity),
- **corner / crop marks** around the featured panel (`.corner-marks`),
- thin **drafting divider lines** at section tops.

The discipline that made it work: **subtle, calm, quiet, secondary to
readability.** A motif that announces itself becomes a gimmick. Pick at most one
or two, derived from your anchor, and keep them quiet.

## Imagery policy

Decide this explicitly. Civic Blueprint chose **almost no conventional
imagery** — no stock photos, no people-at-laptops — because that would have
instantly cheapened a serious project. Identity came from structure, type, and
layout instead. Your project may differ (a product or a person-led business may
need real photography), but make it a _decision_, not an accident of whatever
images were lying around.

## Tone guardrails

Close the spec with two short lists: what the site should feel like, and what it
must never feel like. Civic Blueprint's "should": serious, precise, publicly
useful, structurally thoughtful, open to critique, measured-optimistic. Its
"never": startup landing page, campaign site, donation funnel, AI-futurist demo,
glossy thought-leadership blog. These lists are the tie-breaker for every later
judgment call.

## The questions to ask

- What is the anchor, and what does it already communicate?
- Three adjectives the design must earn?
- Two or three aesthetics it must explicitly _not_ resemble, and why?
- What background color does the emotional work — and is it white by decision or
  by default?
- What's the one primary accent, and where is it allowed to appear?
- What should reading this _feel_ like, and what type earns that?
- What's the smallest set of components, and what are their exact values?
- Is there one subtle motif worth borrowing from the anchor?
- Photos, diagrams, or none?

## Common traps

- **Starting here.** Without Phases 1–2, this is just decorating opinions.
- **Palette-generator soup.** Five accent colors and three gradients. Pick one
  primary; let restraint signal seriousness.
- **Default white.** Stark `#FFFFFF` everywhere is a missed chance to set tone.
- **Motif as theme park.** Overusing the signature element until it's a gimmick.
- **Stock photography reflex.** Generic imagery weakens almost any serious site.
- **A "TBD" spec.** If a value isn't decided, the build will decide it for you,
  inconsistently.

## What "done" looks like

Every token has a real value, components are specified, the motif (if any) is
defined, and the tone guardrails are written. Proceed to
[Phase 4: Copy & Content](./04-copy-and-content.md).

> Worked example: the full Civic Blueprint token set as shipped is in the
> [case study](./case-study-civic-blueprint.md#phase-3).
