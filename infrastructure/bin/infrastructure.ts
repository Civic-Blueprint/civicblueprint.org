#!/usr/bin/env node
import { App, RemovalPolicy } from "aws-cdk-lib";
import { config } from "../config";
import { DnsStack } from "../lib/dns-stack";
import { GitHubOidcStack } from "../lib/github-oidc-stack";
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
  removalPolicy: RemovalPolicy.DESTROY,
});
stagingSiteStack.addDependency(dnsStack);

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

const githubOidcStack = new GitHubOidcStack(app, "CivicBlueprintGitHubOidc", {
  env,
  githubOrg: config.githubOrg,
  githubRepo: config.githubRepo,
  productionSiteBucket: productionSiteStack.bucket,
  productionDistribution: productionSiteStack.distribution,
  stagingSiteBucket: stagingSiteStack.bucket,
  stagingDistribution: stagingSiteStack.distribution,
});
githubOidcStack.addDependency(stagingSiteStack);
githubOidcStack.addDependency(productionSiteStack);
