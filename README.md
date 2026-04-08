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
- `CivicBlueprintGitHubOidc` - GitHub Actions OIDC provider and deploy role

## CI/CD

GitHub Actions workflow: `.github/workflows/deploy.yml`

- Pull requests to `main` deploy to the `staging` GitHub environment
- Pushes to `main` deploy to the `production` GitHub environment
- AWS auth uses OIDC via `aws-actions/configure-aws-credentials`
- No long-lived AWS keys are committed

Required environment secrets (per GitHub Environment):

- `AWS_DEPLOY_ROLE_ARN`
- `S3_BUCKET_NAME`
- `CF_DISTRIBUTION_ID`

## Current docs

- `docs/WEBSITE_PHASE_1_BRIEF.md` - Phase 1 scope, audience, and launch plan
- `docs/HOMEPAGE_COPY_DRAFT.md` - draft homepage copy based on the Phase 1 brief
- `docs/HOMEPAGE_DESIGN_SYSTEM_SPEC.md` - first-pass design system and visual language
- `docs/HOMEPAGE_UX_FIRST_PASS.md` - UX structure, information architecture, and conversion flow
- `docs/PROOF_OF_USEFULNESS_MEMO_01.md` - first proof-of-usefulness memo (comparative: housing permitting + AI governance)
- `docs/PROOF_OF_USEFULNESS_MEMO_01_HOUSING_PERMITTING.md` - archival housing-only draft, superseded by the comparative memo above

## Relationship to project-2028

This repository contains public-facing artifacts and deployment code. The analytical work, foundational documents, and structured agent exchanges that produced these artifacts live in [project-2028](https://github.com/Civic-Blueprint/project-2028).

Each document here traces back to specific exchanges in that repo. To understand why a document exists, what question it was answering, and what debates shaped it, see the [Exchange Index](https://github.com/Civic-Blueprint/project-2028/blob/main/agent/exchanges/_EXCHANGE_INDEX.md) in project-2028.
