# civicblueprint.org

Public website and deployment infrastructure for Civic Blueprint.

## Repository Structure

- `website/` - Next.js 16 static website
- `infrastructure/` - AWS CDK app for Route 53, ACM, S3, CloudFront, and GitHub OIDC
- `docs/` - content, design, and planning docs

## Website Development

### Requirements

- Node.js 20+
- npm 10+

### Run locally

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build check

```bash
cd website
npm run build
```

`website/next.config.ts` is configured with `output: "export"` so `npm run build` emits static files to `website/out/`.

### Markdown content setup (project-2028)

The docs routes under `website/src/app/docs/` render markdown from the sibling `project-2028` repository.

Local setup:

```bash
cd website
./scripts/setup-content.sh
```

This syncs the sibling repo into `website/content/project-2028`, excluding internal/operational files (agent config, steward planning, triage templates, etc.) that should not appear on the public website. See the `--exclude` list in `setup-content.sh` for the full set.

Run `./scripts/setup-content.sh` again whenever markdown content changes locally.

**Content allowlisting:** The website uses a two-layer filter to control which project-2028 files become public pages:

1. **Sync layer** (`setup-content.sh`): excludes operational files from being copied into the content directory at all.
2. **Category layer** (`website/src/lib/content.ts`): uses an explicit `CORE_PATHS` allowlist for core documents. Files that don't match any known category default to `"other"` and are excluded from the site. New files added to project-2028 will not appear on the website unless they are placed in a recognized directory (`memos/`, `proposals/`, `agent/exchanges/`, `agent/process/`, `formation-docs/`) or explicitly added to `CORE_PATHS`.

**Link rewriting:** Markdown links to `.md` files are automatically rewritten at build time. Links to published documents become internal `/docs/...` routes. Links to unpublished files (e.g., `ROADMAP.md`, `WEBSITE_SUBMISSION_TRIAGE_CHECKLIST.md`) are rewritten to their GitHub blob URLs so they remain functional on the website without requiring manual edits to every source file.

Then run the website:

```bash
cd website
npm run dev
```

### Visual snapshots (Playwright)

```bash
cd website
npm run dev
# in another terminal
npm run test:e2e:update
```

Run without updating snapshots:

```bash
cd website
npm run test:e2e
```

## Infrastructure (AWS CDK)

See `infrastructure/README.md` for full details. Quick start:

```bash
cd infrastructure
npm install
npm run build
npx cdk bootstrap aws://ACCOUNT_ID/us-east-1
npx cdk deploy CivicBlueprintDns
# update registrar with NameServer1-NameServer4 outputs
npx cdk deploy --all
```

### Stack overview

- `CivicBlueprintDns` - Route 53 hosted zone + ACM certificate
- `CivicBlueprintStagingSite` - staging S3 + CloudFront + Route 53 alias
- `CivicBlueprintProductionSite` - production S3 + CloudFront + apex/www aliases
- `CivicBlueprintSubmissionApi` - API Gateway + Lambda endpoint for non-GitHub response submissions
- `CivicBlueprintGitHubOidc` - GitHub Actions OIDC provider and deploy role

## CI/CD

Workflows:

- `.github/workflows/deploy.yml` - website static build/deploy only
- `.github/workflows/infrastructure-ci.yml` - infrastructure build/synth validation
- `.github/workflows/infrastructure-deploy.yml` - CDK infrastructure deploys to staging then production

Website deploy behavior (`deploy.yml`):

- Pull requests to `main` deploy to the `staging` GitHub environment
- Pushes to `main` deploy to the `production` GitHub environment
- Build job caches npm dependencies and `website/.next/cache` to reduce repeated Next.js build time
- `repository_dispatch` event type `content-updated` deploys to `staging` first, then requires `production` environment approval before production deploy
- AWS auth uses OIDC via `aws-actions/configure-aws-credentials`
- No long-lived AWS keys are committed

Infrastructure deploy behavior (`infrastructure-deploy.yml`):

- Pushes to `main` with `infrastructure/**` changes deploy infra automatically
- Deploy order is `staging` then `production`
- `production` must be approved via GitHub Environment protection rules

Required environment secrets (per GitHub Environment):

- `AWS_DEPLOY_ROLE_ARN`
- `S3_BUCKET_NAME`
- `CF_DISTRIBUTION_ID`

Required repository variable:

- `NEXT_PUBLIC_SUBMISSION_API_URL` (API base URL output from `CivicBlueprintSubmissionApi`)

Set `AWS_DEPLOY_ROLE_ARN` per environment from CDK outputs:

- `staging` -> `GitHubStagingDeployRoleArn`
- `production` -> `GitHubProdDeployRoleArn`

Set `AWS_INFRA_DEPLOY_ROLE_ARN` per infrastructure environment from CDK outputs:

- `staging` -> `GitHubInfrastructureStagingDeployRoleArn`
- `production` -> `GitHubInfrastructureProductionDeployRoleArn`

### project-2028 content dispatch

`project-2028` includes `.github/workflows/notify-website.yml`, which sends a `repository_dispatch` event to this repository when markdown files change on `main`.

`project-2028` dispatch auth should use a GitHub App installation token (recommended) instead of a personal access token:

1. Create an org GitHub App at <https://github.com/organizations/Civic-Blueprint/settings/apps/new>.
2. Grant repository permissions:
   - `Contents`: `Read and write`
   - `Metadata`: `Read-only`
3. Install the app on `Civic-Blueprint/civicblueprint.org`.
4. In `Civic-Blueprint/project-2028`, configure:
   - Repository variable: `DISPATCH_APP_ID`
   - Repository secret: `DISPATCH_APP_PRIVATE_KEY` (private key `.pem` contents)
5. Remove legacy secret `WEBSITE_DISPATCH_TOKEN` from `project-2028`.

Content publish flow:

- `project-2028` main push (markdown) -> `repository_dispatch` -> `civicblueprint.org` build
- `deploy-staging` runs first
- `deploy-prod` runs only after `production` environment approval

Staging crawler policy:

- Staging deploy overwrites `robots.txt` with `Disallow: /`
- Staging deploy removes `sitemap.xml`
- Staging CloudFront injects `X-Robots-Tag: noindex, nofollow` on responses

Production SEO and social previews:

- `website/src/app/sitemap.ts` publishes document routes with category-based priority and document `lastModified` dates from source file mtimes.
- `website/src/app/robots.ts` allows indexing and points crawlers to `https://civicblueprint.org/sitemap.xml`.
- `website/public/og-default.jpg` is the branded 1200x630 Open Graph image referenced by all pages for social sharing.
- `website/src/app/docs/[...slug]/page.tsx` adds per-document Open Graph/Twitter metadata plus `Article` and `BreadcrumbList` JSON-LD.
- `website/src/app/layout.tsx` adds site-level Organization JSON-LD and a default social image fallback.

### Docs mobile UX

Docs pages now include a mobile-first navigation and readability pass:

- route-safe primary nav links from docs pages
- persistent mobile document switcher
- improved docs link tap targets and active state treatment
- overflow-safe table behavior and tighter mobile typography defaults

## Current docs

- `docs/WEBSITE_PHASE_1_BRIEF.md` - Phase 1 scope, audience, and launch plan
- `docs/HOMEPAGE_COPY_DRAFT.md` - draft homepage copy based on the Phase 1 brief
- `docs/WEBSITE_PHASE_2_BRIEF.md` - Phase 2 narrative pivot, evidence page, Start Here, framework reframing, and incremental ship plan
- `docs/HOMEPAGE_COPY_DRAFT_PHASE_2.md` - draft homepage copy for the alignment-first Phase 2 narrative
- `docs/HOMEPAGE_DESIGN_SYSTEM_SPEC.md` - first-pass design system and visual language
- `docs/HOMEPAGE_UX_FIRST_PASS.md` - UX structure, information architecture, and conversion flow
- `docs/PROOF_OF_USEFULNESS_MEMO_01.md` - first proof-of-usefulness memo (comparative: housing permitting + AI governance)
- `docs/PROOF_OF_USEFULNESS_MEMO_01_HOUSING_PERMITTING.md` - archival housing-only draft, superseded by the comparative memo above

## Relationship to project-2028

This repository contains public-facing artifacts and deployment code. The analytical work, foundational documents, and structured agent exchanges that produced these artifacts live in [project-2028](https://github.com/Civic-Blueprint/project-2028).

Each document here traces back to specific exchanges in that repo. To understand why a document exists, what question it was answering, and what debates shaped it, see the [Exchange Index](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/exchanges/_EXCHANGE_INDEX.md) in project-2028.
