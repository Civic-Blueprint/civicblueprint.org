<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Repository Layout

- Next.js website code lives under `website/`.
- AWS CDK infrastructure code lives under `infrastructure/`.
- Documentation and planning artifacts live under `docs/`.

## Cross-repo authority chain

This repository publishes claims that originate in the analytical workspace at [`project-2028`](https://github.com/Civic-Blueprint/project-2028). When editing copy that makes substantive claims about the project's positions, look up the canonical text in `project-2028` before changing wording — do not silently restate or rephrase project commitments from memory or from prior website copy.

### Substantive authority — what the project actually says

These four documents are the canonical statements of project position. Site copy that paraphrases them must remain faithful to current wording, including section titles and anchors.

- [`PRINCIPLES.md`](https://github.com/Civic-Blueprint/project-2028/blob/main/PRINCIPLES.md) — the seventeen foundational commitments
- [`FOUNDATIONAL_COMMITMENTS.md`](https://github.com/Civic-Blueprint/project-2028/blob/main/FOUNDATIONAL_COMMITMENTS.md) — operational companion to Principles
- [`PROBLEM_MAP.md`](https://github.com/Civic-Blueprint/project-2028/blob/main/PROBLEM_MAP.md) — the fifteen-domain diagnostic
- [`SYSTEMS_FRAMEWORK.md`](https://github.com/Civic-Blueprint/project-2028/blob/main/SYSTEMS_FRAMEWORK.md) — the design companion to the Problem Map

### Labeling rule — provenance on published artifacts

Any new or revised public-facing document must carry the appropriate `provenance` label from the canonical [Content Provenance Standard](https://github.com/Civic-Blueprint/project-2028/blob/main/docs/CONTENT_PROVENANCE.md): `human`, `collaborative`, `ai-generated, steward-curated`, or `ai-generated`. Pages that synthesize multiple sources should default to `collaborative` unless they carry only direct steward voice.

### Lookup surfaces — where to find prior work

Before drafting new copy that touches a topic the project has already worked on, check the index for prior exchanges, source digests, or audits:

- [Exchange Index](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/exchanges/_EXCHANGE_INDEX.md) — chronological record of structured agent-steward discussions with dependency links
- [Source Index](https://github.com/Civic-Blueprint/project-2028/blob/main/sources/SOURCE_INDEX.md) — curated reference digests grouped by sub-debate and viewpoint
- [ROADMAP](https://github.com/Civic-Blueprint/project-2028/blob/main/ROADMAP.md) — open TODOs and forward-looking decisions
- [Doctrine Index](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/doctrine/_DOCTRINE_INDEX.md) — adopted operational frameworks (currently empty by design)

### Review protocols — how claims earn confidence

`project-2028` uses four review protocols. Site copy referencing project methodology should name them accurately rather than paraphrase:

- [Adversarial Review Protocol](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/process/adversarial-review-protocol.md) — challenges claims; counteracts convergence bias in multi-agent exchanges
- [Coherence Audit Protocol](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/process/coherence-audit-protocol.md) — checks cross-document consistency; named issue types include `Hallucinated reference`
- [Historical Parallel Test Protocol](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/process/historical-parallel-test-protocol.md) — grounds proposals in historical cases
- [Comparative Alignment Protocol](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/process/comparative-alignment-protocol.md) — maps external formation documents against the principles

### Live drift caveat — Principle 5

As of May 2026, [`PRINCIPLES.md §5`](https://github.com/Civic-Blueprint/project-2028/blob/main/PRINCIPLES.md) ("Critical systems require public-interest governance") and [`FOUNDATIONAL_COMMITMENTS.md §5`](https://github.com/Civic-Blueprint/project-2028/blob/main/FOUNDATIONAL_COMMITMENTS.md) ("Critical systems require inclusive institutions with bounded rules") use **different vocabularies** for the same commitment. This is a known drift tracked under [ROADMAP TODO #1 F1](https://github.com/Civic-Blueprint/project-2028/blob/main/ROADMAP.md) and gated on [Exchange #23 — Principle 5 Revision](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/exchanges/principle-5-revision-exchange.md). Do not silently adopt either vocabulary into site copy; if the topic surfaces in an edit, route the decision to the steward.

### Anti-hallucination guard for citations

When citing or anchoring against any `project-2028` document, **quote the actual current section heading verbatim** and generate the anchor mechanically from the heading. Do not paraphrase section titles from memory or from prior website copy. This is the same authoring guard `project-2028/sources/README.md` applies to source digests, adopted after the April 2026 coherence audit caught ~67 hallucinated anchors across the digest corpus. The `Hallucinated reference` issue type is defined in the [Coherence Audit Protocol](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/process/coherence-audit-protocol.md).
