

# Civic Blueprint — Homepage Design System Spec (V1)

## Purpose

This document defines the first-pass visual and interaction design system for the Civic Blueprint homepage.

It is intended to guide:
- homepage design
- frontend implementation
- future component styling
- visual consistency across the public website

This is not a full brand book.
It is a practical design system for shipping the first public version of the site.

---

# 1. Design Intent

## Core feeling
The site should feel like:

# editorial civic systems design

A blend of:
- public-interest think tank
- architectural blueprint
- serious product clarity
- open-source civic infrastructure

---

## The site should communicate
- seriousness
- precision
- public usefulness
- structural thinking
- openness to critique
- measured optimism

---

## The site should not feel like
- a startup landing page
- a political campaign site
- a nonprofit donation funnel
- an AI futurist product demo
- a glossy thought-leadership blog

---

# 2. Brand Foundation

## Core visual anchor
The existing Civic Blueprint logo / avatar is the visual foundation.

The website should adapt to the logo, not the other way around.

The logo suggests:
- blueprint logic
- technical precision
- drafting language
- civic infrastructure
- quiet institutional seriousness

This should shape the entire website system.

---

# 3. Color System

## Primary Palette

### Blueprint Navy
**Hex:** `#123E7C`

Use for:
- primary CTAs
- key links
- active nav items
- section emphasis
- important headings / accents

---

### Technical Blue
**Hex:** `#2B5A96`

Use for:
- hover states
- secondary buttons
- supporting visual accents
- subtle emphasis
- diagrams / cards / section markers

---

### Drafting Surface
**Hex:** `#F7F4EF`

Use for:
- page background
- section backgrounds
- cards when needed
- overall warmth / paper feel

---

### Drafting Line Gray-Blue
**Hex:** `#C7D2E3`

Use for:
- dividers
- borders
- grid lines
- card outlines
- subtle structural UI elements

---

## Neutral Palette

### Ink
**Hex:** `#111827`
Use for:
- body text
- strong contrast text
- dense reading content

### Slate
**Hex:** `#334155`
Use for:
- secondary text
- labels
- supporting UI copy

### Muted Gray
**Hex:** `#64748B`
Use for:
- metadata
- low-emphasis labels
- helper text

### Soft Line
**Hex:** `#E5E7EB`
Use for:
- subtle borders
- dividers
- layout structure

### White
**Hex:** `#FFFFFF`
Use for:
- cards
- overlays
- contrast surfaces

---

## Accent Usage Rules

### Do
- Use Blueprint Navy sparingly but confidently
- Use Technical Blue for supporting emphasis
- Let whitespace / warm surface do a lot of the work
- Keep visual hierarchy calm and controlled

### Don’t
- Overuse saturated blue everywhere
- Introduce bright “tech” colors
- Add unnecessary gradients
- Use too many accent colors at once

---

# 4. Typography System

## Typography intent
Typography should feel:
- public
- readable
- durable
- precise
- slightly architectural

---

## Recommended Font Pairing

### UI / Body / Navigation
# Public Sans

Use for:
- body text
- buttons
- nav
- cards
- labels
- metadata

Why:
- excellent readability
- civic / institutional feel
- highly appropriate for this project

---

### Display / Large headings (recommended option)
# Source Serif 4

Use for:
- hero headline
- major section headings
- featured quote / statement moments

Why:
- editorial seriousness
- warmth without softness
- supports long-term credibility

---

## Alternative typography fallback
If you prefer to keep the site fully sans-serif:
- Public Sans for everything
- Use weight / size / spacing to create hierarchy

This is also a viable and clean direction.

---

## Type Scale (recommended)

### Hero Headline
- `text-5xl` to `text-7xl`
- tight line height
- slightly negative tracking

### Section Headings
- `text-3xl` to `text-5xl`

### Card Titles
- `text-xl` to `text-2xl`

### Body Copy
- `text-base` to `text-lg`
- line-height generous enough for readability

### Metadata / Labels
- `text-sm`

---

## Typography Rules

### Do
- Keep line lengths comfortable
- Use hierarchy aggressively but cleanly
- Let headings breathe
- Use contrast in weight and scale rather than decoration

### Don’t
- Over-style headings
- Use overly elegant or fragile serif fonts
- Compress dense explanatory content too tightly

---

# 5. Layout System

## Overall layout intent
The site should feel:

# engineered, not ornamental

Meaning:
- strong structure
- clear sections
- visible hierarchy
- disciplined spacing
- modular composition

---

## Grid recommendation
Use a modern responsive content grid:

### Desktop
- max width around `1200px–1280px`
- generous horizontal breathing room

### Content reading width
- keep long-form text around `65–75ch`

### Section structure
Most homepage sections should use one of these patterns:
- centered single-column
- two-column explanatory layout
- card grid
- featured panel / memo card

---

## Spacing system
Use generous vertical spacing.

### Recommended spacing rhythm
- section padding: `py-20` to `py-32`
- card padding: `p-6` to `p-10`
- compact UI spacing: `gap-3`, `gap-4`, `gap-6`

### Design principle
Whitespace is part of the trust signal.
Do not over-compress.

---

# 6. Surfaces and Cards

## Card philosophy
Cards should feel like:
- structured information panels
- blueprint modules
- editorial reference blocks

Not generic SaaS feature boxes.

---

## Card styling guidance
### Recommended characteristics
- subtle border
- modest radius
- clean shadow or no shadow
- strong internal spacing
- crisp hierarchy

### Suggested visual baseline
- background: white or drafting surface
- border: Drafting Line Gray-Blue or Soft Line
- radius: medium (`rounded-xl` or `rounded-2xl`)
- shadows: extremely restrained

---

## Featured card treatment
The featured memo card can be slightly more designed than the rest.

Potential enhancements:
- blueprint corner marks
- structural divider line
- technical annotation feel
- slightly heavier border treatment

This is one of the best places to introduce the logo’s drafting language.

---

# 7. Buttons and Interaction

## Button philosophy
Buttons should feel:
- confident
- clean
- serious
- frictionless

Not salesy.

---

## Primary button
### Style
- background: Blueprint Navy
- text: white
- radius: rounded but not overly soft
- weight: medium to semibold

### Tone
This is the main action button style.
Use sparingly.

---

## Secondary button
### Style
- transparent or drafting-surface background
- Blueprint Navy border or text
- lower visual weight than primary

---

## Text links
Text links should feel editorial and intentional.

### Recommended style
- navy or slate text
- subtle underline or underline-on-hover
- no “cheap app” hover effects

---

## Interaction behavior
### Hover states should be
- restrained
- crisp
- immediate
- not flashy

### Avoid
- bounce / springy animations
- glows
- over-designed motion
- aggressive transforms

---

# 8. Visual Language and Motifs

## This is one of the most important sections.

The Civic Blueprint logo contains a very strong visual language that the site should borrow **subtly**.

### Existing visual motifs in the logo
- drafting marks
- technical geometry
- blueprint panel logic
- construction lines
- measured structure

These should inform the site.

---

## Approved motif ideas

### 1. Faint grid overlays
Use in:
- hero background
- memo card background
- subtle section accents

### 2. Drafting-style divider lines
Use in:
- section breaks
- card headers
- highlighted framework modules

### 3. Corner marks / crop marks
Use sparingly around:
- featured content
- framework panels
- memo callouts

### 4. Structural framing
Some panels can feel like “reference sheets” or “blueprint boards.”

---

## Important warning
These motifs must remain:
- subtle
- calm
- quiet
- secondary to readability

The site should never feel:
- gimmicky
- futuristic for its own sake
- dashboard-like
- over-designed

---

# 9. Imagery and Graphics

## Recommended imagery approach
Use very little conventional imagery.

This site likely does **not** need:
- stock photos
- generic people-at-laptops images
- smiling teamwork photos

That would weaken the project immediately.

---

## Better alternatives
Use:
- diagrams
- structured visual panels
- subtle maps / systems graphics
- memo thumbnails
- document / framework visualization

The visual identity should come from:

# structure, typography, and layout

not decorative imagery.

---

# 10. Accessibility and Readability Standards

## Accessibility is not optional
This project must be usable by:
- younger and older readers
- technical and non-technical readers
- high-context and low-context users
- people arriving from different social / educational contexts

---

## Accessibility design requirements

### Readability
- strong contrast
- generous line height
- readable body size
- calm hierarchy

### Navigation
- simple top-level choices
- obvious CTA hierarchy
- low cognitive friction

### Interaction
- no reliance on subtle-only cues
- clear hover / focus states
- keyboard-friendly structure

### Content structure
- support skim reading and deep reading
- headings should do real work
- cards and sections should feel navigable

---

## Core principle
# Layering, not flattening.

The site should not oversimplify the project.
It should simply make entry possible at multiple levels.

---

# 11. Homepage-Specific Design Notes

## Core conversion goal
The homepage should get someone from:

# curious → reading Memo 01 in under 60 seconds

That means:
- headline clarity matters more than visual cleverness
- CTA hierarchy matters more than extra features
- featured memo presentation matters more than decorative sections

---

## UX hierarchy to preserve
### Most important elements
1. Hero clarity
2. Memo 01 featured conversion section
3. “Why this matters” context
4. Framework credibility
5. Contribution / challenge pathway

If something competes with those, it should probably be removed.

---

# 12. Tone Guardrails

## The site should feel like
- a serious public project
- a framework under construction
- an invitation to test and challenge ideas

## The site should not feel like
- a polished certainty machine
- a branding exercise
- a polished persuasion funnel
- a startup trying to “capture users”

The tone should remain:

# serious, open, and testable

---

# 13. Best Immediate Implementation Priorities

## Phase 1 visual priorities
1. Strong hero typography
2. Clear memo feature card
3. Clean section spacing and hierarchy
4. Calm, logo-native color system
5. Simple but strong card system
6. Subtle blueprint motif usage

---

## Final design principle

This homepage should not feel like:
> “Welcome to our project.”

It should feel like:

# “Here’s a claim. Test it.”