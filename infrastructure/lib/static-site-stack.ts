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
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
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
  certificate: Certificate;
  subdomain?: string;
  includeWwwAlias?: boolean;
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
    request.uri += '/index.html';
  }

  return request;
}
`),
    });

    this.distribution = new Distribution(this, "SiteDistribution", {
      certificate: props.certificate,
      domainNames: aliases,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(this.bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
        functionAssociations: [
          {
            eventType: FunctionEventType.VIEWER_REQUEST,
            function: urlRewriteFunction,
          },
        ],
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
