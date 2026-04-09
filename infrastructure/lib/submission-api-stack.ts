import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnStage,
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";
import path from "node:path";

export interface SubmissionApiStackProps extends StackProps {
  domainName: string;
  githubOrg: string;
  githubRepo: string;
  githubAppSecretName: string;
  submissionMetricNamespace: string;
}

export class SubmissionApiStack extends Stack {
  public readonly api: HttpApi;
  public readonly submissionApiUrl: string;
  public readonly submissionApiStageName: string;
  public readonly submissionHandler: NodejsFunction;

  constructor(scope: Construct, id: string, props: SubmissionApiStackProps) {
    super(scope, id, props);

    const githubAppSecret = Secret.fromSecretNameV2(
      this,
      "GitHubAppSecret",
      props.githubAppSecretName,
    );

    const allowedOrigins = [
      `https://${props.domainName}`,
      `https://www.${props.domainName}`,
      `https://staging.${props.domainName}`,
    ];

    this.submissionHandler = new NodejsFunction(this, "SubmissionHandler", {
      runtime: Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../lambda/submission/index.ts"),
      handler: "handler",
      timeout: Duration.seconds(15),
      environment: {
        ALLOWED_ORIGINS: allowedOrigins.join(","),
        GITHUB_APP_SECRET_NAME: props.githubAppSecretName,
        GITHUB_OWNER: props.githubOrg,
        GITHUB_REPO: props.githubRepo,
        SUBMISSION_METRIC_NAMESPACE: props.submissionMetricNamespace,
      },
    });
    githubAppSecret.grantRead(this.submissionHandler);

    this.api = new HttpApi(this, "SubmissionHttpApi", {
      apiName: "civic-blueprint-submission-api",
      corsPreflight: {
        allowHeaders: ["content-type"],
        allowMethods: [CorsHttpMethod.OPTIONS, CorsHttpMethod.POST],
        allowOrigins: allowedOrigins,
      },
      createDefaultStage: true,
    });

    this.api.addRoutes({
      path: "/submit-response",
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        "SubmissionHandlerIntegration",
        this.submissionHandler,
      ),
    });

    this.submissionApiUrl = this.api.url ?? "";
    if (this.submissionApiUrl.length === 0) {
      throw new Error("Expected SubmissionHttpApi to expose a default URL.");
    }

    this.submissionApiStageName =
      this.api.defaultStage?.stageName ?? "$default";

    const cfnStage = this.api.defaultStage?.node.defaultChild as
      | CfnStage
      | undefined;
    if (cfnStage !== undefined) {
      cfnStage.defaultRouteSettings = {
        throttlingBurstLimit: 10,
        throttlingRateLimit: 5,
      };
    }

    new CfnOutput(this, "SubmissionApiUrl", {
      value: this.submissionApiUrl,
    });

    new CfnOutput(this, "SubmissionApiPath", {
      value: `${this.submissionApiUrl}submit-response`,
    });
  }
}
