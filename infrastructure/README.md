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
- GitHub OIDC provider and deploy role for GitHub Actions

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

The workflow at `.github/workflows/deploy.yml` expects these environment-level secrets:

- `AWS_DEPLOY_ROLE_ARN`
- `S3_BUCKET_NAME`
- `CF_DISTRIBUTION_ID`

Use `staging` and `production` GitHub Environments to scope each set of values separately.
