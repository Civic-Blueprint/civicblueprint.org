import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from "aws-cdk-lib/aws-iam";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

type DeployEnvironment = "production" | "staging";

export interface GitHubOidcStackProps extends StackProps {
  githubOrg: string;
  githubRepo: string;
  productionSiteBucket: Bucket;
  productionDistribution: Distribution;
  stagingSiteBucket: Bucket;
  stagingDistribution: Distribution;
}

export class GitHubOidcStack extends Stack {
  public readonly productionDeployRole: Role;
  public readonly stagingDeployRole: Role;

  constructor(scope: Construct, id: string, props: GitHubOidcStackProps) {
    super(scope, id, props);

    // Reuse the account-level GitHub OIDC provider if it already exists.
    const oidcProviderArn = `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`;

    const deployTargets: Array<{
      environment: DeployEnvironment;
      roleId: string;
      roleName: string;
      description: string;
      bucket: Bucket;
      distribution: Distribution;
      outputId: string;
    }> = [
      {
        environment: "production",
        roleId: "GitHubActionsProdDeployRole",
        roleName: "github-actions-prod-deploy-role",
        description:
          "GitHub Actions role for production deploy to S3 and CloudFront invalidation.",
        bucket: props.productionSiteBucket,
        distribution: props.productionDistribution,
        outputId: "GitHubProdDeployRoleArn",
      },
      {
        environment: "staging",
        roleId: "GitHubActionsStagingDeployRole",
        roleName: "github-actions-staging-deploy-role",
        description:
          "GitHub Actions role for staging deploy to S3 and CloudFront invalidation.",
        bucket: props.stagingSiteBucket,
        distribution: props.stagingDistribution,
        outputId: "GitHubStagingDeployRoleArn",
      },
    ];

    const rolesByEnvironment = new Map<DeployEnvironment, Role>();
    for (const target of deployTargets) {
      const role = this.createEnvironmentDeployRole(
        target,
        oidcProviderArn,
        props.githubOrg,
        props.githubRepo,
      );
      rolesByEnvironment.set(target.environment, role);
      this.attachEnvironmentPolicies(role, target.bucket, target.distribution);

      new CfnOutput(this, target.outputId, {
        value: role.roleArn,
      });
    }

    const productionRole = rolesByEnvironment.get("production");
    const stagingRole = rolesByEnvironment.get("staging");
    if (!productionRole || !stagingRole) {
      throw new Error("Missing expected GitHub OIDC deploy role.");
    }

    this.productionDeployRole = productionRole;
    this.stagingDeployRole = stagingRole;
  }

  private createEnvironmentDeployRole(
    target: {
      environment: DeployEnvironment;
      roleId: string;
      roleName: string;
      description: string;
    },
    oidcProviderArn: string,
    githubOrg: string,
    githubRepo: string,
  ): Role {
    return new Role(this, target.roleId, {
      roleName: target.roleName,
      assumedBy: new FederatedPrincipal(
        oidcProviderArn,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
            "token.actions.githubusercontent.com:repository": `${githubOrg}/${githubRepo}`,
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:${githubOrg}/${githubRepo}:environment:${target.environment}`,
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      description: target.description,
    });
  }

  private attachEnvironmentPolicies(
    role: Role,
    bucket: Bucket,
    distribution: Distribution,
  ): void {
    role.addToPolicy(
      new PolicyStatement({
        actions: ["s3:ListBucket"],
        resources: [bucket.bucketArn],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
        resources: [bucket.arnForObjects("*")],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: ["cloudfront:CreateInvalidation"],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        ],
      }),
    );
  }
}
