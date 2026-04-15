#!/usr/bin/env node
import { App, RemovalPolicy } from "aws-cdk-lib";
import { config } from "../config";
import { DnsStack } from "../lib/dns-stack";
import { GitHubOidcStack } from "../lib/github-oidc-stack";
import { MonitoringStack } from "../lib/monitoring-stack";
import { SubmissionApiStack } from "../lib/submission-api-stack";
import { StaticSiteStack } from "../lib/static-site-stack";

const app = new App();
const env = {
  account: config.account,
  region: config.region,
};

const dnsStack = new DnsStack(app, "CivicBlueprintDns", {
  env,
  domainName: config.domainName,
});

const stagingSiteStack = new StaticSiteStack(app, "CivicBlueprintStagingSite", {
  env,
  domainName: config.domainName,
  zone: dnsStack.hostedZone,
  certificate: dnsStack.certificate,
  subdomain: "staging",
  includeWwwAlias: false,
  noIndexHeaders: true,
  removalPolicy: RemovalPolicy.DESTROY,
});
stagingSiteStack.addDependency(dnsStack);

const archiveSiteStack = new StaticSiteStack(
  app,
  "CivicBlueprintArchiveSite",
  {
    env,
    domainName: config.domainName,
    zone: dnsStack.hostedZone,
    subdomain: "archive",
    includeWwwAlias: false,
    noIndexHeaders: true,
    removalPolicy: RemovalPolicy.RETAIN,
  },
);
archiveSiteStack.addDependency(dnsStack);

const productionSiteStack = new StaticSiteStack(
  app,
  "CivicBlueprintProductionSite",
  {
    env,
    domainName: config.domainName,
    zone: dnsStack.hostedZone,
    certificate: dnsStack.certificate,
    includeWwwAlias: true,
    removalPolicy: RemovalPolicy.RETAIN,
  },
);
productionSiteStack.addDependency(dnsStack);

const submissionApiStack = new SubmissionApiStack(
  app,
  "CivicBlueprintSubmissionApi",
  {
    env,
    domainName: config.domainName,
    githubOrg: config.githubOrg,
    githubRepo: "project-2028",
    githubAppSecretName: "civic-blueprint/github-app",
    submissionMetricNamespace: config.monitoring.successMetricNamespace,
  },
);
submissionApiStack.addDependency(dnsStack);

const monitoringStack = new MonitoringStack(app, "CivicBlueprintMonitoring", {
  env,
  alarmPrefix: config.monitoring.alarmPrefix,
  submissionFunction: submissionApiStack.submissionHandler,
  submissionApiId: submissionApiStack.api.apiId,
  submissionApiStageName: submissionApiStack.submissionApiStageName,
  successMetricNamespace: config.monitoring.successMetricNamespace,
  slackWorkspaceId: config.monitoring.slackWorkspaceId,
  slackChannelId: config.monitoring.slackChannelId,
  lambdaHighDurationMsThreshold:
    config.monitoring.lambdaHighDurationMsThreshold,
  lambdaTimeoutLikelyMsThreshold:
    config.monitoring.lambdaTimeoutLikelyMsThreshold,
  api4xxThreshold: config.monitoring.api4xxThreshold,
  noSuccessEvaluationPeriods: config.monitoring.noSuccessEvaluationPeriods,
});
monitoringStack.addDependency(submissionApiStack);

const stagingGithubOidcStack = new GitHubOidcStack(
  app,
  "CivicBlueprintGitHubOidcStaging",
  {
    env,
    githubOrg: config.githubOrg,
    githubRepo: config.githubRepo,
    environment: "staging",
    siteBucket: stagingSiteStack.bucket,
    siteDistribution: stagingSiteStack.distribution,
  },
);
stagingGithubOidcStack.addDependency(stagingSiteStack);

const productionGithubOidcStack = new GitHubOidcStack(
  app,
  "CivicBlueprintGitHubOidcProduction",
  {
    env,
    githubOrg: config.githubOrg,
    githubRepo: config.githubRepo,
    environment: "production",
    siteBucket: productionSiteStack.bucket,
    siteDistribution: productionSiteStack.distribution,
  },
);
productionGithubOidcStack.addDependency(productionSiteStack);
