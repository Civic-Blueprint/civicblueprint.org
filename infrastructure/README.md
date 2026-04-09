# infrastructure

AWS CDK infrastructure for deploying `website/` to AWS and connecting DNS.

## What this deploys

- Route 53 hosted zone for `civicblueprint.org`
- ACM certificate in `us-east-1` for:
  - `civicblueprint.org`
  - `www.civicblueprint.org`
  - `staging.civicblueprint.org`
- Staging static site stack (S3 + CloudFront + Route 53 alias)
- Production static site stack (S3 + CloudFront + Route 53 apex + www aliases)
- Submission API stack (API Gateway HTTP API + Lambda + GitHub issue creation)
- GitHub OIDC provider and two deploy roles for GitHub Actions:
  - `GitHubStagingDeployRoleArn`
  - `GitHubProdDeployRoleArn`
- GitHub OIDC provider and two infrastructure deploy roles for GitHub Actions:
  - `GitHubInfrastructureStagingDeployRoleArn`
  - `GitHubInfrastructureProductionDeployRoleArn`

## Configuration

Set these environment variables when needed:

- `AWS_ACCOUNT_ID` or `CDK_DEFAULT_ACCOUNT`
- `CDK_DEFAULT_REGION` (defaults to `us-east-1`)
- `DOMAIN_NAME` (defaults to `civicblueprint.org`)
- `GITHUB_ORG`
- `GITHUB_REPO` (defaults to `civicblueprint.org`)

Defaults are defined in `config.ts`.

## Install and build

```bash
cd infrastructure
npm install
npm run build
```

## Bootstrap and first deploy

```bash
cd infrastructure
npx cdk bootstrap aws://ACCOUNT_ID/us-east-1
npx cdk deploy CivicBlueprintDns
```

After deploying `CivicBlueprintDns`, copy `NameServer1` through `NameServer4` into your registrar's nameserver configuration for `civicblueprint.org`.

Then deploy the remaining stacks:

```bash
npx cdk deploy --all
```

## Useful commands

```bash
npm run build
npm run synth
npm run diff
npm run deploy
```

## GitHub Actions integration

Infrastructure workflow separation:

- `.github/workflows/infrastructure-ci.yml` validates CDK changes (`build` + `cdk synth`) on PR/push
- `.github/workflows/infrastructure-deploy.yml` deploys infra on `main` changes and supports manual dispatch
- `.github/workflows/deploy.yml` is reserved for static site deployment and content dispatch

The workflow at `.github/workflows/deploy.yml` expects these environment-level secrets:

- `AWS_DEPLOY_ROLE_ARN`
- `S3_BUCKET_NAME`
- `CF_DISTRIBUTION_ID`

Use `staging` and `production` GitHub Environments to scope each set of values separately.

The build job also expects this repository variable:

- `NEXT_PUBLIC_SUBMISSION_API_URL` (for example, `https://abcd1234.execute-api.us-east-1.amazonaws.com/`)

For infrastructure CDK deploy workflow, configure GitHub environment secrets:

- Environment `staging`:
  - `AWS_INFRA_DEPLOY_ROLE_ARN` = `GitHubInfrastructureStagingDeployRoleArn`
- Environment `production`:
  - `AWS_INFRA_DEPLOY_ROLE_ARN` = `GitHubInfrastructureProductionDeployRoleArn`

Use required reviewers on `production` to enforce deployment approval before production infra changes apply.

### Cross-repo dispatch auth (project-2028 -> civicblueprint.org)

Use a GitHub App for dispatch authentication so token lifecycle is not tied to a user PAT.

1. Create org app: <https://github.com/organizations/Civic-Blueprint/settings/apps/new>
2. Configure permissions:
   - `Contents`: `Read and write`
   - `Metadata`: `Read-only`
3. Install app on `Civic-Blueprint/civicblueprint.org`
4. In `Civic-Blueprint/project-2028`, set:
   - Repository variable `DISPATCH_APP_ID`
   - Repository secret `DISPATCH_APP_PRIVATE_KEY` (app private key PEM contents)
5. Remove `WEBSITE_DISPATCH_TOKEN` once GitHub App auth is active

### Submission API GitHub App secret (AWS Secrets Manager)

The website submission API Lambda uses the same GitHub App credentials to create issues in `Civic-Blueprint/project-2028`.

Create this secret once in AWS account `932027117408` (or your configured account):

```bash
aws secretsmanager create-secret \
  --name civic-blueprint/github-app \
  --description "GitHub App credentials for Civic Blueprint submission API (issue creation)" \
  --secret-string "$(jq -n \
    --arg app_id "YOUR_APP_ID" \
    --arg private_key "$(cat /path/to/your-app.private-key.pem)" \
    '{appId: $app_id, privateKey: $private_key}')" \
  --region us-east-1
```

Verify:

```bash
aws secretsmanager describe-secret \
  --secret-id civic-blueprint/github-app \
  --region us-east-1
```

The `CivicBlueprintSubmissionApi` stack grants Lambda read access to this secret and expects JSON keys:

- `appId` (string)
- `privateKey` (PEM contents)

`repository_dispatch` events from `project-2028` follow a staging-first gate:

- Build runs
- `deploy-staging` runs first
- `deploy-prod` waits for `production` environment approval

## Branch protection and environment approvals

Use this helper to configure GitHub protections:

```bash
cd infrastructure
chmod +x scripts/configure-github-guards.sh
./scripts/configure-github-guards.sh
```

The script configures:

- Branch protection on `main` (1 approval, stale dismissal, code owner reviews, conversation resolution, force-push/delete disabled)
- `production` environment protection with required reviewer support and protected-branch deploy policy
- `staging` environment protection with optional reviewers

Optional reviewer IDs:

```bash
export PRODUCTION_REVIEWER_TEAM_ID=123456
export PRODUCTION_REVIEWER_USER_ID=12345678
export STAGING_REVIEWER_TEAM_ID=123456
export STAGING_REVIEWER_USER_ID=12345678
```

Optional name-based lookup (script resolves IDs automatically):

```bash
export PRODUCTION_REVIEWER_USERNAME=Roustalski
export STAGING_REVIEWER_USERNAME=Roustalski
export PRODUCTION_REVIEWER_TEAM_SLUG=platform
export STAGING_REVIEWER_TEAM_SLUG=platform
```

Self-review settings (defaults are `false` to avoid single-reviewer deadlocks):

```bash
export PRODUCTION_PREVENT_SELF_REVIEW=false
export STAGING_PREVENT_SELF_REVIEW=false
```
