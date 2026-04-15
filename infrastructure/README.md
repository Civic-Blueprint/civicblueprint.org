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
- Archive static site stack (`CivicBlueprintArchiveSite`) for `archive.civicblueprint.org` with dedicated ACM certificate and noindex headers
- Submission API stack (API Gateway HTTP API + Lambda + GitHub issue creation)
- GitHub OIDC staging stack (`CivicBlueprintGitHubOidcStaging`) with deploy roles for GitHub Actions:
  - `GitHubStagingDeployRoleArn`
  - `GitHubInfrastructureStagingDeployRoleArn`
- GitHub OIDC production stack (`CivicBlueprintGitHubOidcProduction`) with deploy roles for GitHub Actions:
  - `GitHubProdDeployRoleArn`
  - `GitHubInfrastructureProductionDeployRoleArn`

## Configuration

Set these environment variables:

- `AWS_ACCOUNT_ID` or `CDK_DEFAULT_ACCOUNT` (required)
- `CDK_DEFAULT_REGION` (defaults to `us-east-1`)
- `DOMAIN_NAME` (defaults to `civicblueprint.org`)
- `GITHUB_ORG`
- `GITHUB_REPO` (defaults to `civicblueprint.org`)
- `SUBMISSION_ALERT_ALARM_PREFIX` (defaults to `civic-blueprint-submission-api`)
- `SUBMISSION_METRIC_NAMESPACE` (defaults to `CivicBlueprint/SubmissionApi`)
- `SUBMISSION_LAMBDA_HIGH_DURATION_MS` (defaults to `12000`)
- `SUBMISSION_LAMBDA_TIMEOUT_LIKELY_MS` (defaults to `14500`)
- `SUBMISSION_API_4XX_THRESHOLD` (defaults to `20`)
- `SUBMISSION_NO_SUCCESS_EVALUATION_PERIODS` (defaults to `12`, with 5-minute periods)
- `SLACK_WORKSPACE_ID` (optional; required to enable AWS Chatbot Slack delivery)
- `SLACK_CHANNEL_ID` (optional; required to enable AWS Chatbot Slack delivery)

Defaults are defined in `config.ts`, except for the AWS account ID, which must be provided explicitly.

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

The archive site is infrastructure-managed but not part of routine content deployment. It is intended as a point-in-time snapshot and should only be republished intentionally.

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

For infrastructure CI and deploy workflows, configure this GitHub repository variable:

- `AWS_ACCOUNT_ID` (required by `config.ts` during `cdk synth`)

For Slack alert delivery in infrastructure deploy workflow, configure GitHub environment variables:

- Environment `staging`:
  - `SLACK_WORKSPACE_ID`
  - `SLACK_CHANNEL_ID`
- Environment `production`:
  - `SLACK_WORKSPACE_ID`
  - `SLACK_CHANNEL_ID`

Use required reviewers on `production` to enforce deployment approval before production infra changes apply.

### OIDC stack split migration

The OIDC roles are intentionally split across two stacks to isolate staging from production dependency graphs:

- `CivicBlueprintGitHubOidcStaging`
- `CivicBlueprintGitHubOidcProduction`

One-time migration sequence (run from `infrastructure/` with `AWS_PROFILE=cb-stalski`):

1. Deploy the legacy monolithic OIDC stack with `RemovalPolicy.RETAIN` applied to IAM roles:

   ```bash
   AWS_PROFILE=cb-stalski npx cdk deploy CivicBlueprintGitHubOidc --require-approval never
   ```

2. Destroy the legacy stack so roles become unmanaged but preserved:

   ```bash
   AWS_PROFILE=cb-stalski npx cdk destroy CivicBlueprintGitHubOidc --force
   ```

3. Deploy both split stacks and import the existing retained roles:

   ```bash
   AWS_PROFILE=cb-stalski npx cdk deploy CivicBlueprintGitHubOidcStaging CivicBlueprintGitHubOidcProduction \
     --import-existing-resources --require-approval never
   ```

4. Remove temporary retain policy in code and deploy both split stacks again:

   ```bash
   AWS_PROFILE=cb-stalski npx cdk deploy CivicBlueprintGitHubOidcStaging CivicBlueprintGitHubOidcProduction \
     --require-approval never
   ```

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

Create this secret once in your configured AWS account:

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

### Submission payload sizing

The submission Lambda accepts message bodies up to `200000` characters.

When a submission message is larger than GitHub's per-issue body limit (`65536` characters), the API automatically:

1. Writes the first segment into the issue body with a continuation notice.
2. Writes remaining segments as sequential comments on the same issue.

This preserves long-form responses without requiring users to manually split their feedback.

### Submission API monitoring and Slack alerting

The infrastructure now deploys `CivicBlueprintMonitoring`, which creates:

- CloudWatch alarms for Lambda errors, throttles, high duration, and timeout risk
- CloudWatch alarms for API Gateway HTTP API 5XX and 4XX burst conditions
- A submission health alarm that detects traffic with no successful submissions
- An SNS topic used for all submission alert notifications
- Optional AWS Chatbot Slack integration when `SLACK_WORKSPACE_ID` and `SLACK_CHANNEL_ID` are provided

Slack integration setup:

1. Open AWS Chatbot console: <https://console.aws.amazon.com/chatbot/home>
2. Authorize your Slack workspace once in the AWS account.
3. Collect:
   - Slack workspace ID (format similar to `T01234567`)
   - Slack channel ID (format similar to `C01234567`)
4. Export environment variables before deploy:

```bash
export SLACK_WORKSPACE_ID=T01234567
export SLACK_CHANNEL_ID=C01234567
```

Deploy monitoring updates:

```bash
cd infrastructure
npm run build
npx cdk deploy CivicBlueprintMonitoring CivicBlueprintSubmissionApi
```

If Slack IDs are omitted, alarms and SNS are still deployed, and stack output `SlackIntegrationConfigured` remains `false`.

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
