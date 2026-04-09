# Analytics and Privacy Implementation

## Summary

The website now uses a two-layer analytics model:

1. **Plausible Analytics** for anonymous, cookie-free page metrics.
2. **Microsoft Clarity** for optional interaction analytics (session replay and heatmaps) behind explicit consent.

This supports the Phase 1 goal of "basic analytics or lightweight feedback tracking" while preserving a privacy-first default.

## Data Use

- **Plausible (always on):** page views, referral source, device/browser, coarse geography, and time-on-page metrics.
- **Clarity (opt-in):** click patterns, scroll depth, and anonymized session recordings.
- **Use case:** improve readability, navigation, and content prioritization; not advertising or cross-site profiling.

## User Consent Model

- The site displays a consent banner for optional cookies.
- Accepting optional cookies enables Clarity.
- Declining keeps Clarity disabled.
- Consent can be reviewed from `/privacy`.

## Privacy Policy Page

- Public policy is available at `/privacy`.
- The page documents:
  - what data is collected
  - why it is collected
  - which cookies are used
  - retention and third-party service links
  - how users can change consent choices

## Configuration

Set these environment variables for production analytics:

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_PLAUSIBLE_SRC` (preferred, uses Plausible-provided `pa-*.js` script)
- `NEXT_PUBLIC_CLARITY_ID`
- `NEXT_PUBLIC_SUBMISSION_API_URL` (existing)

Staging intentionally does not load analytics. The app enforces this at runtime by only loading analytics scripts on production hostnames (`civicblueprint.org` and `www.civicblueprint.org`).

A local template is provided at `website/.env.example`.
