# Phase 2 — UX & Information Architecture

**Question this phase answers:** _How does a stranger move from "curious" to
taking the single action — and how do we serve experts and novices at once?_

**Artifact produced:** a UX pass (the decision funnel + section flow) and an
information architecture (the page set).

**Exit criteria:** you can trace an unbroken path from the hero to the single
action (Phase 1, 1.6), and every homepage section has exactly one job.

---

## Why this phase exists

The brief says what's true. The UX pass decides the **order in which a stranger
encounters it**. Order is most of the experience. The same facts arranged
"problem → claim → proof" feel like an argument; arranged "proof → problem →
claim" they feel like a brochure. This phase is where you choose the argument's
shape before a single pixel is styled.

Civic Blueprint's UX pass committed to one ruthless objective: _"Get someone
from curious → reading the memo in under 60 seconds. Everything else is
secondary."_ A single measurable objective like that is worth more than ten
pages of wireframes, because it lets you cut anything that doesn't serve it.

## Principle 1: the decision funnel (the 60-second journey)

A first-time visitor evaluates in layers, each only earned if the previous one
landed. Design the homepage to answer them in sequence:

- **Layer 1 (5–10s): "What is this and why should I care?"** — the hero must
  answer this alone, with no scrolling and no jargon.
- **Layer 2 (15–30s): "Is this worth my time?"** — quick context + the core
  claim. This is where a skeptical visitor decides to keep reading.
- **Layer 3 (30–60s): "OK, I'll do the thing."** — the featured proof and the
  call to action.

Write the literal sentence each layer should produce in the visitor's head. If
you can't, the section isn't ready.

## Principle 2: layering, not flattening

The hardest UX constraint in a serious project is serving very different
visitors without alienating any of them. The answer is **depth layers**, not
lowest-common-denominator simplification:

1. **Intuitive** — plain language, stakes, "why this matters to you."
2. **Conceptual** — structured explanations, clean definitions, digestible
   summaries.
3. **Technical** — the full docs, the real depth, for the expert who wants it.
4. **Contribution / conversion** — the path to act, whatever your single action
   is.

> _"The core ideas should remain rigorous. The interface should become human."_

The same idea is reachable at every layer; the visitor self-selects depth. A
"grandmother test" strip (could a smart non-expert get the gist?) sits right
next to a link into dense source material, and neither insults the other.

## Principle 3: participation must feel possible

Beyond _understanding_, the visitor should feel **invited** and **capable** —
that acting (buying, contributing, booking, challenging) is within reach without
credentials or insider knowledge. Friction toward the single action is the enemy;
remove steps, name the next move explicitly, never make the visitor guess.

## The questions to ask

### Funnel

- What is the literal thought each of the three layers must produce?
- What is the single most compelling _true_ sentence you can lead with? (That's
  your headline candidate.)
- What's the fastest honest proof you can show? (That's your featured panel.)

### Architecture

- What is the smallest set of pages that supports the single action? (Civic
  Blueprint Phase 1 shipped five: Home, Start Here, the proof artifact, Read the
  Framework, Contribute.)
- For each page, what's its one job and who is it for?
- What's the smallest top nav that works? (3–5 items. More nav is usually unsolved
  IA.)

### Homepage section flow

- List sections in order; give each one job. A strong default to adapt:
  1. **Hero** — what/why/what-next in one screen.
  2. **Quick context strip** — 3–4 one-line cards for fast orientation (the
     intuitive layer).
  3. **Why this exists** — ground it in recognizable reality.
  4. **The core claim / the shift** — the one analytical or value move that makes
     someone think "this might be worth it."
  5. **Featured proof** — the conversion engine: a real artifact/case/demo
     presented like a product, not a link.
  6. **What you offer / framework overview** — modular cards, not walls of text.
  7. **What you want from the visitor** — set the quality/expectation of the
     action.
  8. **How to act** — a few large, clear, low-friction options.
  9. **Closing** — one strong final frame + one clean action.
- What competes with the most important sections (hero, proof, action)? Cut it.

### The hero, specifically

Design the hero as a unit. Decide every slot:

- Eyebrow (optional small label that orients)
- Headline (the strongest true sentence)
- Subhead (the supporting idea)
- Primary CTA + secondary CTA(s)
- A posture/honesty line (Civic Blueprint kept _"A working framework. Not settled
  truth. Designed to be challenged."_ — it disarms skeptics and sets the tone in
  one line)

## Turning answers into the artifact

Write a UX document with: the core objective (one sentence), the funnel (three
layers with their target thoughts), the depth-layer map, the homepage section
flow (each with its job), the hero spec (every slot filled), and the IA (page
list with purposes). Keep it in words and structure — no styling yet. Styling
without an agreed structure just argues about taste.

## Common traps

- **Decoration before structure.** Picking a hero image before deciding what the
  hero must _say_.
- **Hero overload.** Trying to say everything above the fold. The hero answers
  Layer 1 only.
- **Flattening for "accessibility."** Dumbing down the whole site instead of
  layering depth. You lose the experts and bore everyone.
- **Nav as a sitemap.** Seven nav items is usually four unmade decisions.
- **Proof as a link.** Burying your best evidence in a list instead of featuring
  it like the product it is.

## What "done" looks like

You can narrate the path from hero to single action out loud, every section has
one job, the hero spec is complete, and you have a minimal page list. Proceed to
[Phase 3: Design System](./03-design-system.md).

> Worked example: Civic Blueprint's funnel, layering model, and section flow are
> in the [case study](./case-study-civic-blueprint.md#phase-2).
