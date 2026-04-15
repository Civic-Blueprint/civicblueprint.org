import * as fs from "node:fs";
import * as path from "node:path";
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  AllowedMethods,
  CachedMethods,
  CachePolicy,
  Distribution,
  Function,
  FunctionCode,
  FunctionEventType,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  Certificate,
  CertificateValidation,
  type ICertificate,
} from "aws-cdk-lib/aws-certificatemanager";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import {
  AaaaRecord,
  ARecord,
  HostedZone,
  RecordTarget,
} from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export interface StaticSiteStackProps extends StackProps {
  domainName: string;
  zone: HostedZone;
  certificate?: ICertificate;
  subdomain?: string;
  includeWwwAlias?: boolean;
  noIndexHeaders?: boolean;
  removalPolicy: RemovalPolicy;
}

export class StaticSiteStack extends Stack {
  public readonly bucket: Bucket;
  public readonly distribution: Distribution;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const siteDomain = props.subdomain
      ? `${props.subdomain}.${props.domainName}`
      : props.domainName;
    const aliases = [siteDomain];
    if (props.includeWwwAlias) {
      aliases.push(`www.${props.domainName}`);
    }

    const certificate =
      props.certificate ??
      new Certificate(this, "SiteCertificate", {
        domainName: siteDomain,
        validation: CertificateValidation.fromDns(props.zone),
      });

    const securityHeadersPolicy = new ResponseHeadersPolicy(
      this,
      "SecurityHeadersPolicy",
      {
        comment: "CSP and standard security response headers for website.",
        customHeadersBehavior: {
          customHeaders: [
            {
              header: "Permissions-Policy",
              value:
                "accelerometer=(), autoplay=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()",
              override: true,
            },
          ],
        },
        securityHeadersBehavior: {
          contentSecurityPolicy: {
            contentSecurityPolicy:
              "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://*.clarity.ms; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://plausible.io https://*.clarity.ms https://*.execute-api.us-east-1.amazonaws.com;",
            override: true,
          },
          contentTypeOptions: {
            override: true,
          },
          frameOptions: {
            frameOption: HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy:
              HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
            override: true,
          },
          strictTransportSecurity: {
            accessControlMaxAge: Duration.days(365),
            includeSubdomains: true,
            preload: true,
            override: true,
          },
          xssProtection: {
            modeBlock: true,
            protection: true,
            override: true,
          },
        },
      },
    );

    this.bucket = new Bucket(this, "SiteBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      autoDeleteObjects: props.removalPolicy === RemovalPolicy.DESTROY,
      removalPolicy: props.removalPolicy,
      versioned: false,
    });

    const urlRewriteFunction = new Function(this, "UrlRewriteFunction", {
      code: FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '.html';
  }

  return request;
}
`),
    });

    const functionAssociations = [
      {
        eventType: FunctionEventType.VIEWER_REQUEST,
        function: urlRewriteFunction,
      },
    ];

    if (props.noIndexHeaders === true) {
      const noIndexHeadersFunction = new Function(
        this,
        "NoIndexHeadersFunction",
        {
          code: FunctionCode.fromInline(`
function handler(event) {
  var response = event.response;
  response.headers["x-robots-tag"] = { value: "noindex, nofollow" };
  return response;
}
`),
        },
      );
      functionAssociations.push({
        eventType: FunctionEventType.VIEWER_RESPONSE,
        function: noIndexHeadersFunction,
      });
    }

    this.distribution = new Distribution(this, "SiteDistribution", {
      certificate,
      domainNames: aliases,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
        responseHeadersPolicy: securityHeadersPolicy,
        functionAssociations,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.minutes(5),
        },
      ],
    });

    new ARecord(this, "AliasRecordA", {
      zone: props.zone,
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
    });

    new AaaaRecord(this, "AliasRecordAaaa", {
      zone: props.zone,
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
    });

    if (props.includeWwwAlias) {
      new ARecord(this, "WwwAliasRecordA", {
        zone: props.zone,
        recordName: `www.${props.domainName}`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
      });

      new AaaaRecord(this, "WwwAliasRecordAaaa", {
        zone: props.zone,
        recordName: `www.${props.domainName}`,
        target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
      });
    }

    const siteBuildPath = path.resolve(__dirname, "../../website/out");
    if (fs.existsSync(siteBuildPath)) {
      new BucketDeployment(this, "DeployStaticAssets", {
        sources: [Source.asset(siteBuildPath)],
        destinationBucket: this.bucket,
        distribution: this.distribution,
        distributionPaths: ["/*"],
      });
    }

    new CfnOutput(this, "SiteBucketName", {
      value: this.bucket.bucketName,
    });

    new CfnOutput(this, "CloudFrontDistributionId", {
      value: this.distribution.distributionId,
    });

    new CfnOutput(this, "CloudFrontDomainName", {
      value: this.distribution.distributionDomainName,
    });

    new CfnOutput(this, "SiteDomain", {
      value: siteDomain,
    });
  }
}
