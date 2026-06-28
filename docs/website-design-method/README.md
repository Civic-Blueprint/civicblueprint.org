# The Website Design Method

_A question-driven walk-through for designing and building a website you actually love — without a drag-and-drop CMS._

## What this is

This is a reusable **method**, not a template and not a theme. It is the
sequence of questions, principles, and decisions that produced
[civicblueprint.org](https://civicblueprint.org), abstracted into a process any
project can follow to reach its own coherent result.

A CMS hands you a blank canvas and a thousand widgets, then asks you to have
taste in real time. This method does the opposite: it asks you a structured set
of **questions** in a deliberate order, and each answer narrows the next set of
decisions until the design is mostly determined by what you already said you
believe. The output is not "a website that looks like the template." It is a
website that looks like _your project told the truth about itself_.

The method is intentionally tool-light. It assumes you (or an agent working with
you) can write Markdown and edit a small codebase. The hard part was never the
code — it was knowing what to build and why. This documents the "why."

## The core thesis

> **Good websites are arguments made visible. The job of the process is to find
> the argument first, then let structure, type, color, and copy carry it.**

Every consequential decision in the Civic Blueprint build — the serif headline,
the warm paper background, the blueprint grid, the "Here's a claim. Test it."
posture — traces back to an answer given in an earlier phase. Nothing was chosen
because it was trendy. That traceability is the whole point, and it is what a CMS
cannot give you.

## The six phases

The method runs in one direction. Each phase produces a durable artifact that
becomes the input to the next. You can loop back, but you should not skip ahead —
a design system written before the brief is just decoration with opinions.

| # | Phase | Question it answers | Artifact produced |
|---|-------|--------------------|-------------------|
| 1 | **Discovery & Brief** | What is this, who is it for, and what must it accomplish? | A written brief |
| 2 | **UX & Information Architecture** | How does a stranger move from "curious" to "convinced"? | A UX pass + IA / section flow |
| 3 | **Visual Identity & Design System** | What does this project _feel_ like, and what are the rules? | A design system spec (tokens) |
| 4 | **Copy & Content** | What are the exact words, in what voice, with what provenance? | A copy draft, section by section |
| 5 | **Build & Validation** | How do we ship it accessibly and prove it works? | A deployed, tested site |
| 6 | **Repositioning without rebuild** | The business/thesis changed — what do we keep? | A reframe brief, not a redo |

```
Brief ──▶ UX / IA ──▶ Design System ──▶ Copy ──▶ Build / Validate
  ▲                                                      │
  └──────────────── Phase 6: reframe, don't rebuild ─────┘
```

## How to use it

There are two ways in:

1. **The fast path — fill out the [`WORKBOOK.md`](./WORKBOOK.md).** It is the
   whole method compressed into one fillable document: every question, in order,
   with a blank under it. Answer the questions and you will have ~80% of your
   brief, UX, and design direction written in your own words. This is the
   "anti-CMS" artifact — the thing a person actually walks through.

2. **The deep path — read the phase guides.** Each phase has its own file with
   the full question bank, the principles behind the questions, how to turn
   answers into decisions, the output template, and the exit criteria for moving
   on:

   - [`01-discovery-and-brief.md`](./01-discovery-and-brief.md)
   - [`02-ux-and-architecture.md`](./02-ux-and-architecture.md)
   - [`03-design-system.md`](./03-design-system.md)
   - [`04-copy-and-content.md`](./04-copy-and-content.md)
   - [`05-build-and-validation.md`](./05-build-and-validation.md)
   - [`06-repositioning-without-rebuild.md`](./06-repositioning-without-rebuild.md)

3. **The example — read the [case study](./case-study-civic-blueprint.md).** It
   maps every phase to the actual decision Civic Blueprint made, the question
   that forced it, and the file where it landed. Read this when an abstract
   instruction isn't clicking; the worked example usually makes it concrete.

### Recommended first session

For a brand-new site, do this in order and stop where you run out of confident
answers — the gaps tell you what you still need to learn:

1. Read this README and the [case study](./case-study-civic-blueprint.md).
2. Open the [`WORKBOOK.md`](./WORKBOOK.md) and answer Phase 1 and Phase 2.
3. Only then look at visual references. (Picking colors before you know your
   audience is how you end up with a beautiful site for the wrong person.)

## Principles that hold across all phases

These are not phase-specific. They are the spine of the method.

1. **Question before artifact.** Never open a design tool or a code editor to
   "explore." Open a document and answer a question. Design is the residue of
   answered questions.
2. **Anchor, then adapt.** Find the one fixed point the rest of the site must
   obey — a logo, a thesis, a single sentence — and make everything serve it.
   For Civic Blueprint the rule was literally _"the website should adapt to the
   logo, not the other way around."_
3. **Layering, not flattening.** Make the site reachable by a non-expert without
   dumbing it down for an expert. Same ideas, multiple depths.
4. **Whitespace and restraint are trust signals.** Calm, structured, and
   under-decorated reads as serious. Busy reads as either desperate or
   amateur.
5. **Evidence before assertion.** Show the thing, then name it. Let the artifact
   persuade before the copy claims.
6. **Posture over polish.** Decide what the site should make a visitor _feel
   like doing_ ("test this claim," "book a call," "trust these people") before
   you decide what it should look like.

## Provenance

This document set is **collaborative**: AI-drafted, steward-curated. It is a
retrospective abstraction of a real build, derived directly from these source
artifacts in this repository:

- `docs/WEBSITE_PHASE_1_BRIEF.md` (Phase 1 strategy, audience, product principles)
- `docs/HOMEPAGE_UX_FIRST_PASS.md` (UX objective, decision funnel, layering, visual direction)
- `docs/HOMEPAGE_DESIGN_SYSTEM_SPEC.md` (color, type, layout, motifs, tone guardrails)
- `docs/HOMEPAGE_COPY_DRAFT.md` and `docs/HOMEPAGE_COPY_DRAFT_PHASE_2.md` (copy method)
- `docs/WEBSITE_PHASE_2_BRIEF.md` (the reposition-without-rebuild pattern)
- The shipped implementation under `website/` (tokens, fonts, components)

These method docs are planning artifacts, kept alongside the rest of `docs/`.
They are not published as public website pages and do not restate any
`project-2028` positions; they describe _how the site was made_, not what the
project claims.

## Portability

The folder is self-contained on purpose. To run the method on another project,
copy `docs/website-design-method/` into that project's repo and start a fresh
`WORKBOOK.md`. The method is project-agnostic; only the answers change.
