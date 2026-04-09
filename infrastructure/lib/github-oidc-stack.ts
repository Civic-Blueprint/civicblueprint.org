import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { FederatedPrincipal, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
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
  public readonly infrastructureProductionDeployRole: Role;
  public readonly infrastructureStagingDeployRole: Role;

  constructor(scope: Construct, id: string, props: GitHubOidcStackProps) {
    super(scope, id, props);

    // Reuse the account-level GitHub OIDC provider if it already exists.
    const oidcProviderArn = `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`;

    const staticDeployTargets: Array<{
      environment: DeployEnvironment;
      roleId: string;
      roleName: string;
      description: string;
      bucket: Bucket;
      distribution: Distribution;
      outputId: string;
      trustedEnvironmentName: string;
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
        trustedEnvironmentName: "production",
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
        trustedEnvironmentName: "staging",
      },
    ];

    const rolesByEnvironment = new Map<DeployEnvironment, Role>();
    for (const target of staticDeployTargets) {
      const role = this.createEnvironmentDeployRole(
        {
          roleId: target.roleId,
          roleName: target.roleName,
          description: target.description,
          trustedEnvironmentName: target.trustedEnvironmentName,
        },
        oidcProviderArn,
        props.githubOrg,
        props.githubRepo,
      );
      rolesByEnvironment.set(target.environment, role);
      this.attachStaticSitePolicies(role, target.bucket, target.distribution);

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

    const infrastructureTargets: Array<{
      environment: DeployEnvironment;
      roleId: string;
      roleName: string;
      description: string;
      outputId: string;
    }> = [
      {
        environment: "staging",
        roleId: "GitHubActionsInfrastructureStagingDeployRole",
        roleName: "github-actions-infrastructure-staging-deploy-role",
        description:
          "GitHub Actions role for staging infrastructure CDK deploy workflow.",
        outputId: "GitHubInfrastructureStagingDeployRoleArn",
      },
      {
        environment: "production",
        roleId: "GitHubActionsInfrastructureProductionDeployRole",
        roleName: "github-actions-infrastructure-production-deploy-role",
        description:
          "GitHub Actions role for production infrastructure CDK deploy workflow.",
        outputId: "GitHubInfrastructureProductionDeployRoleArn",
      },
    ];

    const infrastructureRolesByEnvironment = new Map<DeployEnvironment, Role>();
    for (const target of infrastructureTargets) {
      const role = this.createEnvironmentDeployRole(
        {
          roleId: target.roleId,
          roleName: target.roleName,
          description: target.description,
          trustedEnvironmentName: target.environment,
        },
        oidcProviderArn,
        props.githubOrg,
        props.githubRepo,
      );

      infrastructureRolesByEnvironment.set(target.environment, role);
      this.attachInfrastructureDeployPolicies(role);

      new CfnOutput(this, target.outputId, {
        value: role.roleArn,
      });
    }

    const infrastructureStagingRole =
      infrastructureRolesByEnvironment.get("staging");
    const infrastructureProductionRole =
      infrastructureRolesByEnvironment.get("production");
    if (!infrastructureStagingRole || !infrastructureProductionRole) {
      throw new Error(
        "Missing expected GitHub OIDC infrastructure deploy role.",
      );
    }

    this.infrastructureStagingDeployRole = infrastructureStagingRole;
    this.infrastructureProductionDeployRole = infrastructureProductionRole;
  }

  private createEnvironmentDeployRole(
    target: {
      roleId: string;
      roleName: string;
      description: string;
      trustedEnvironmentName: string;
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
            "token.actions.githubusercontent.com:sub": `repo:${githubOrg}/${githubRepo}:environment:${target.trustedEnvironmentName}`,
          },
        },
        "sts:AssumeRoleWithWebIdentity",
      ),
      description: target.description,
    });
  }

  private attachStaticSitePolicies(
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

  private attachInfrastructureDeployPolicies(role: Role): void {
    const deployRoleArnPatterns = [
      `arn:aws:iam::${this.account}:role/cdk-*`,
      `arn:aws:iam::${this.account}:role/civic-blueprint-*`,
      `arn:aws:iam::${this.account}:role/CivicBlueprint*`,
      `arn:aws:iam::${this.account}:role/github-actions-*`,
    ];
    const deployPolicyArnPatterns = [
      `arn:aws:iam::${this.account}:policy/cdk-*`,
      `arn:aws:iam::${this.account}:policy/civic-blueprint-*`,
      `arn:aws:iam::${this.account}:policy/CivicBlueprint*`,
      `arn:aws:iam::${this.account}:policy/github-actions-*`,
    ];

    role.addToPolicy(
      new PolicyStatement({
        actions: ["cloudformation:*"],
        resources: ["*"],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "s3:*",
          "cloudfront:*",
          "apigateway:*",
          "execute-api:*",
          "route53:*",
          "acm:*",
          "lambda:*",
          "logs:*",
          "ssm:GetParameter",
        ],
        resources: ["*"],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "iam:AttachRolePolicy",
          "iam:CreatePolicy",
          "iam:CreatePolicyVersion",
          "iam:CreateRole",
          "iam:DeletePolicy",
          "iam:DeletePolicyVersion",
          "iam:DeleteRole",
          "iam:DeleteRolePolicy",
          "iam:DetachRolePolicy",
          "iam:GetPolicy",
          "iam:GetPolicyVersion",
          "iam:GetRole",
          "iam:GetRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListPolicyVersions",
          "iam:ListRolePolicies",
          "iam:PassRole",
          "iam:PutRolePolicy",
          "iam:TagPolicy",
          "iam:TagRole",
          "iam:UntagPolicy",
          "iam:UntagRole",
          "iam:UpdateAssumeRolePolicy",
          "iam:UpdateRole",
        ],
        resources: [...deployRoleArnPatterns, ...deployPolicyArnPatterns],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: ["iam:CreateServiceLinkedRole"],
        resources: ["*"],
      }),
    );

    role.addToPolicy(
      new PolicyStatement({
        actions: [
          "secretsmanager:DescribeSecret",
          "secretsmanager:GetResourcePolicy",
          "secretsmanager:GetSecretValue",
          "secretsmanager:ListSecretVersionIds",
          "secretsmanager:PutResourcePolicy",
          "secretsmanager:UpdateSecret",
        ],
        resources: [
          `arn:aws:secretsmanager:${this.region}:${this.account}:secret:civic-blueprint/*`,
        ],
      }),
    );
  }
}
