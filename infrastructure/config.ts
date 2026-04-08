export type DeploymentEnvironment = "staging" | "production";

export const config = {
  account:
    process.env.CDK_DEFAULT_ACCOUNT ??
    process.env.AWS_ACCOUNT_ID ??
    "932027117408",
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  domainName: process.env.DOMAIN_NAME ?? "civicblueprint.org",
  githubOrg: process.env.GITHUB_ORG ?? "Civic-Blueprint",
  githubRepo: process.env.GITHUB_REPO ?? "civicblueprint.org",
} as const;
