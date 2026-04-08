import { CfnOutput, Fn, Stack, StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export interface DnsStackProps extends StackProps {
  domainName: string;
}

export class DnsStack extends Stack {
  public readonly hostedZone: HostedZone;
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props);

    this.hostedZone = new HostedZone(this, "HostedZone", {
      zoneName: props.domainName,
    });

    this.certificate = new Certificate(this, "SiteCertificate", {
      domainName: props.domainName,
      subjectAlternativeNames: [
        `www.${props.domainName}`,
        `staging.${props.domainName}`,
      ],
      validation: CertificateValidation.fromDns(this.hostedZone),
    });

    new CfnOutput(this, "HostedZoneId", {
      value: this.hostedZone.hostedZoneId,
    });

    new CfnOutput(this, "CertificateArn", {
      value: this.certificate.certificateArn,
    });

    const nameServers = this.hostedZone.hostedZoneNameServers;
    if (nameServers) {
      new CfnOutput(this, "NameServer1", {
        value: Fn.select(0, nameServers),
        description: "Route53 nameserver 1",
      });
      new CfnOutput(this, "NameServer2", {
        value: Fn.select(1, nameServers),
        description: "Route53 nameserver 2",
      });
      new CfnOutput(this, "NameServer3", {
        value: Fn.select(2, nameServers),
        description: "Route53 nameserver 3",
      });
      new CfnOutput(this, "NameServer4", {
        value: Fn.select(3, nameServers),
        description: "Route53 nameserver 4",
      });
    }
  }
}
