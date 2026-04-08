import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  FederatedPrincipal,
  OpenIdConnectProvider,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface GitHubOidcStackProps extends StackProps {
  githubOrg: string;
  githubRepo: string;
  siteBucket: Bucket;
  distribution: Distribution;
}

export class GitHubOidcStack extends Stack {
  public readonly deployRole: Role;

  constructor(scope: Construct, id: string, props: GitHubOidcStackProps) {
    super(scope, id, props);

    const oidcProvider = new OpenIdConnectProvider(this, "GitHubOidcProvider", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });

    this.deployRole = new Role(this, "GitHubActionsDeployRole", {
      roleName: "github-actions-deploy-role",
      assumedBy: new FederatedPrincipal(
        oidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${props.githubOrg}/${props.githubRepo}:*`,
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      description:
        "GitHub Actions role for deploying static assets and invalidating CloudFront.",
    });

    this.deployRole.addToPolicy(
      new PolicyStatement({
        actions: ["s3:ListBucket"],
        resources: [props.siteBucket.bucketArn],
      }),
    );

    this.deployRole.addToPolicy(
      new PolicyStatement({
        actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        resources: [props.siteBucket.arnForObjects("*")],
      }),
    );

    this.deployRole.addToPolicy(
      new PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${props.distribution.distributionId}`,
        ],
      }),
    );

    new CfnOutput(this, "GitHubDeployRoleArn", {
      value: this.deployRole.roleArn,
    });
  }
}
