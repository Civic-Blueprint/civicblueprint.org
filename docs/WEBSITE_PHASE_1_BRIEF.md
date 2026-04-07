# Civic Blueprint Website Phase 1 Brief

## Purpose

This document turns the repository's current "public entry point" idea into a concrete Phase 1 plan.

The goal is not to launch a fully mature public platform. The goal is to create the smallest credible website that helps Civic Blueprint move from internal document development to external challenge, expert review, and practical learning.

This brief is based on the project's current repository state:

- `README.md` identifies a public entry point as one of the two next tracks.
- `agent/exchanges/post-systems-framework-next-steps.md` argues that GitHub is not a viable front door for the people the project most needs.
- The adversarial review in that same exchange argues that the website should be sequenced around a proof-of-usefulness artifact and shipped in a deliberately minimal form.

## What This Phase Is For

Phase 1 is for stress-testing the framework in public under conditions that produce useful disagreement.

More specifically, it is for:

- making the project legible to serious outsiders without requiring GitHub or Markdown fluency
- giving domain experts and adjacent practitioners a clear way to challenge the project's strongest claims
- demonstrating at least one concrete case where the framework produces analytical value
- creating a contribution path that is lighter than "read four long files and open a PR"

Phase 1 is not for:

- broad public awareness at any cost
- a polished general-audience civic media platform
- multilingual launch
- a full interactive dependency graph
- proving that the current framework is correct

## Phase 1 Strategy

Phase 1 should follow this sequence:

1. Produce one proof-of-usefulness artifact.
2. Build the smallest website that can present that artifact, explain the project, and invite challenge.
3. Use the site to recruit a small number of high-value human reviewers.

This sequence follows the strongest internal critique already present in the repository: the project needs something to show before it asks serious people to engage.

## Primary Audience

The Phase 1 site should be designed for the first right audience, not the final audience.

Primary audience:

- civic technologists
- public-interest product and operations people
- public administration and state capacity researchers
- policy-adjacent builders and institutional reform writers
- domain experts able to challenge the project's assumptions in one or more sections

Secondary audience:

- thoughtful non-specialists who can follow a plain-language summary and decide whether the project is worth deeper reading

Not the primary launch audience:

- "everyone"
- broad social media traffic
- people looking for a movement to join before they understand the work

## Product Principles

Phase 1 should follow these principles:

### 1. Plain language at the entry point

The landing experience should explain what Civic Blueprint is, why it exists, and what kind of challenge it is seeking in direct language.

### 2. Scannable writing

People scan web pages before they commit to reading them. Phase 1 copy should therefore use meaningful headings, short paragraphs, bulleted lists, and conclusion-first structure rather than long uninterrupted prose. This aligns with Nielsen Norman Group guidance on web reading behavior.

### 3. Objective tone

The site should avoid hype, branding language, and movement-style promotion. The project is more credible when it sounds like an open analytical project inviting scrutiny rather than a campaign asking for loyalty.

### 4. Accessibility from the start

Phase 1 does not need to solve every accessibility and internationalization challenge at launch, but it should start with accessible structure:

- semantic HTML
- keyboard-accessible navigation
- alt text for images and diagrams
- strong color contrast
- mobile-friendly layouts
- readable type sizes and spacing

This aligns with W3C guidance that accessibility should be built in from the beginning, not added later.

### 5. Challenge, not applause

The site should invite readers to identify what the project is missing, overstating, or getting wrong. The core call to action is closer to "pressure-test this" than "support this."

## Core Message

The homepage should communicate four ideas quickly:

1. Civic Blueprint is an open project for thinking seriously about how key systems fail and how they might be redesigned.
2. The repository already contains a substantial draft framework.
3. That framework is provisional and needs external challenge, empirical grounding, and domain expertise.
4. This site exists to make that challenge easier.

## Homepage Outline

The homepage should be short enough to scan, but strong enough to establish seriousness.

Recommended section order:

1. **Hero**
   - One-sentence statement of purpose
   - One-sentence statement of epistemic posture
   - Primary calls to action:
     - Read the first proof-of-usefulness artifact
     - Start here
     - Challenge this work

2. **Why this exists**
   - Short explanation of the project's core premise
   - Link to the longer repository documents for readers who want depth

3. **Why this site exists**
   - Explain that GitHub is where the working documents live, but not the only reasonable entry point
   - Explain that this phase is for external challenge, not internal self-validation

4. **What the framework currently says**
   - Very short summaries of:
     - `PRINCIPLES.md`
     - `PROBLEM_MAP.md`
     - `SYSTEMS_FRAMEWORK.md`

5. **Start with one concrete example**
   - Feature the proof-of-usefulness artifact
   - Explain why this specific case was chosen

6. **What kind of input is most useful**
   - Domain expertise
   - historical parallels
   - missing perspectives
   - implementation critique
   - direct disagreement with the framework's strongest claims

7. **How to respond**
   - Link to public contribution path
   - Link to non-GitHub contact path

## Suggested Homepage Copy Direction

The opening message should sound like this in spirit:

- Civic Blueprint is an open attempt to think clearly about how critical systems fail and how they might be redesigned.
- The project already has substantial working documents.
- Those documents are hypotheses under pressure, not final answers.
- This site exists to make the work legible enough for serious outsiders to challenge it.

## Minimum Information Architecture

Phase 1 should ship with five pages or page types.

### 1. Home

Purpose:

- explain the project in plain language
- communicate why this phase exists
- route different readers to the right next step

Must include:

- short project summary
- why GitHub is not the only entry point
- clear links to the proof-of-usefulness artifact, core documents, and contribution path
- an explicit invitation to challenge the work

### 2. Start Here

Purpose:

- orient first-time readers
- explain the relationship between `PRINCIPLES.md`, `PROBLEM_MAP.md`, and `SYSTEMS_FRAMEWORK.md`

Must include:

- a one-paragraph description of each core document
- suggested reading order
- "if you only have 10 minutes / 30 minutes / 2 hours" paths

### 3. Proof-of-Usefulness

Purpose:

- show that the framework can illuminate a real policy bottleneck better than a generic issue summary can

This is the most important Phase 1 page after the homepage.

### 4. Read the Framework

Purpose:

- provide a readable, navigable web presentation of the core documents

Minimum requirements:

- document-level navigation
- section anchors
- strong typography
- easy movement between related documents

### 5. Challenge or Contribute

Purpose:

- convert interest into useful external input

Must include:

- the kinds of feedback the project wants most
- who the project most wants to hear from
- how to submit critique or expertise
- what a useful contribution looks like

## Recommended First Proof-of-Usefulness Artifact

Phase 1 should start with one concrete policy bottleneck that is legible, consequential, and structurally connected to the framework's main hypotheses.

Recommended first topic:

**Housing permitting as a test case for institutional capacity and recursive uplift**

Why this topic is the strongest Phase 1 candidate:

- it is concrete and legible to non-specialists
- it directly connects to the Systems Framework's first-move hypotheses around institutional capacity, permitting reform, infrastructure, and housing
- it allows the project to show cross-domain reasoning rather than a single-issue take
- it is easier to compare against standard policy discourse than a more abstract topic like "institutional legitimacy"

The artifact should answer:

- what the standard framing of the problem usually emphasizes
- what the Civic Blueprint framework sees that the standard framing misses
- which dependencies matter most
- where the framework may be wrong or incomplete
- what kinds of domain expertise would most improve the analysis

Recommended format:

- 1,500-3,000 word memo
- one simple dependency diagram
- a short "What this framework adds" section
- a short "What would change our mind" section

## Proof-of-Usefulness Outline

The first artifact should be structured so a serious reader can quickly compare Civic Blueprint's framing to standard discourse.

Recommended outline:

1. **The familiar problem statement**
   - How housing permitting is usually framed
   - What those framings get right

2. **What the standard framing misses**
   - the institutional capacity layer
   - the infrastructure and permitting layer
   - the democratic process layer
   - the trust and legitimacy layer

3. **Dependency walk-through**
   - show how the problem is connected to upstream and downstream systems
   - identify where the bottlenecks are structural rather than merely ideological

4. **Why this matters strategically**
   - explain why this case is useful as an early demonstration of competence
   - connect it to the Systems Framework's current first-move hypotheses without overstating certainty

5. **Where the framework may be wrong**
   - assumptions that need challenge
   - missing evidence
   - missing perspectives

6. **What useful feedback would look like**
   - practitioner critique
   - counterexamples
   - historical parallels
   - alternative causal models

## Contribution Funnel

Phase 1 should make it easy for a new visitor to move from curiosity to a specific next action.

Suggested funnel:

1. Read the homepage summary.
2. Read the proof-of-usefulness artifact or a short "Start Here" guide.
3. Choose one action:
   - challenge a claim
   - share domain expertise
   - point to a historical case
   - suggest a missing perspective
4. Use a lightweight public mechanism to respond.

The contribution mechanism does not need to be elaborate at launch. It does need to be explicit.

Minimum options:

- link to GitHub issues for those comfortable using them
- a plain contact option for people who are not

## Launch Scope

Phase 1 launch should include:

- homepage
- Start Here page
- one proof-of-usefulness artifact
- readable web versions of the core docs
- one contribution page
- basic analytics or lightweight feedback tracking

Phase 1 launch should not wait for:

- multilingual support
- interactive graph tooling
- a full public wiki
- multiple case studies
- a generalized community platform
- a polished visual identity system

## Success Criteria

Phase 1 is successful if it produces signs of useful reality contact.

The first success metrics should be qualitative before they are quantitative:

- at least a few serious readers reach out with specific critique rather than generic praise
- at least one domain expert identifies an assumption, missing case, or weak claim the project had not previously surfaced
- the proof-of-usefulness artifact reveals at least one place where the framework needs revision
- the site makes it easier to point people to the project without first explaining the repository structure

Quantitative indicators can follow:

- visits to the homepage and proof-of-usefulness page
- number of substantive inbound responses
- number of responses from target audience categories
- number of resulting issues, revisions, or follow-up exchanges

## Content Guidelines

To keep Phase 1 aligned with both the repository's voice and external best practices:

- lead with the conclusion
- prefer short sections over long uninterrupted blocks
- use concrete language over conceptual slogans
- avoid promotional copy
- include outbound links where they increase credibility
- tell readers exactly what kind of help is wanted

## Technical Guidance

Phase 1 should prefer a static site or similarly simple stack.

Selection criteria:

- fast to ship
- low maintenance
- accessible by default
- easy to host
- supports long-form reading well

The stack choice matters less than the ability to publish readable pages quickly and revise them easily.

## Explicit Deferrals for Later Phases

These are important, but they should not block Phase 1:

- full internationalization
- multiple audience-specific landing pages
- interactive dependency graph exploration
- broader public storytelling and campaign-style outreach
- live events, office hours, or community channels beyond the minimum viable contribution path
- multiple proof-of-usefulness artifacts

## Immediate Next Actions

1. Decide the exact first proof-of-usefulness topic and outline.
2. Draft homepage copy around the question: "What is this, and why should a serious outsider spend time on it?"
3. Decide the minimum contribution channel for non-GitHub users.
4. Choose a lightweight site stack.
5. Ship the smallest usable version and learn from real responses.

## External Notes

This brief is consistent with current external guidance:

- Open source onboarding guidance continues to emphasize reducing friction, documenting the contributor path, and giving people a public place to engage outside repo mechanics.
- Nielsen Norman Group continues to recommend concise, scannable, objective web writing because users scan before they read.
- W3C guidance continues to emphasize incorporating accessibility from the beginning rather than trying to retrofit it after launch.
