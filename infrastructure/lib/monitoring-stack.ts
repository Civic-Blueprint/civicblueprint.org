import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import * as chatbot from "aws-cdk-lib/aws-chatbot";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as cloudwatchActions from "aws-cdk-lib/aws-cloudwatch-actions";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";

export interface MonitoringStackProps extends StackProps {
  alarmPrefix: string;
  submissionFunction: IFunction;
  submissionApiId: string;
  submissionApiStageName: string;
  successMetricNamespace: string;
  slackWorkspaceId: string;
  slackChannelId: string;
  lambdaHighDurationMsThreshold: number;
  lambdaTimeoutLikelyMsThreshold: number;
  api4xxThreshold: number;
  noSuccessEvaluationPeriods: number;
}

export class MonitoringStack extends Stack {
  public readonly alertTopic: sns.Topic;

  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    this.alertTopic = new sns.Topic(this, "SubmissionAlertTopic", {
      topicName: `${props.alarmPrefix}-alerts`,
      displayName: "Civic Blueprint submission API alerts",
    });

    const alarmAction = new cloudwatchActions.SnsAction(this.alertTopic);
    const metricPeriod = Duration.minutes(5);

    const lambdaErrorAlarm = new cloudwatch.Alarm(this, "LambdaErrorsAlarm", {
      alarmName: `${props.alarmPrefix}-lambda-errors`,
      alarmDescription: "Submission API Lambda returned one or more errors.",
      metric: props.submissionFunction.metricErrors({
        period: metricPeriod,
        statistic: "sum",
      }),
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    lambdaErrorAlarm.addAlarmAction(alarmAction);

    const lambdaThrottleAlarm = new cloudwatch.Alarm(
      this,
      "LambdaThrottlesAlarm",
      {
        alarmName: `${props.alarmPrefix}-lambda-throttles`,
        alarmDescription: "Submission API Lambda is being throttled.",
        metric: props.submissionFunction.metricThrottles({
          period: metricPeriod,
          statistic: "sum",
        }),
        threshold: 1,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    );
    lambdaThrottleAlarm.addAlarmAction(alarmAction);

    const lambdaHighDurationAlarm = new cloudwatch.Alarm(
      this,
      "LambdaHighDurationAlarm",
      {
        alarmName: `${props.alarmPrefix}-lambda-high-duration`,
        alarmDescription:
          "Submission API Lambda duration is elevated (p95) and may impact UX.",
        metric: props.submissionFunction.metricDuration({
          period: metricPeriod,
          statistic: "p95",
        }),
        threshold: props.lambdaHighDurationMsThreshold,
        evaluationPeriods: 3,
        datapointsToAlarm: 2,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    );
    lambdaHighDurationAlarm.addAlarmAction(alarmAction);

    const lambdaTimeoutLikelyAlarm = new cloudwatch.Alarm(
      this,
      "LambdaTimeoutLikelyAlarm",
      {
        alarmName: `${props.alarmPrefix}-lambda-timeout-likely`,
        alarmDescription:
          "Submission API Lambda max duration is near timeout, indicating likely timeout risk.",
        metric: props.submissionFunction.metricDuration({
          period: metricPeriod,
          statistic: "max",
        }),
        threshold: props.lambdaTimeoutLikelyMsThreshold,
        evaluationPeriods: 1,
        datapointsToAlarm: 1,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator:
          cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      },
    );
    lambdaTimeoutLikelyAlarm.addAlarmAction(alarmAction);

    const apiDimensions = {
      ApiId: props.submissionApiId,
      Stage: props.submissionApiStageName,
    };

    const api5xxAlarm = new cloudwatch.Alarm(this, "Api5xxAlarm", {
      alarmName: `${props.alarmPrefix}-api-5xx`,
      alarmDescription: "Submission API returned 5XX responses.",
      metric: new cloudwatch.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "5xx",
        dimensionsMap: apiDimensions,
        period: metricPeriod,
        statistic: "sum",
      }),
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    api5xxAlarm.addAlarmAction(alarmAction);

    const api4xxAlarm = new cloudwatch.Alarm(this, "Api4xxBurstAlarm", {
      alarmName: `${props.alarmPrefix}-api-4xx-burst`,
      alarmDescription:
        "Submission API has elevated 4XX responses, indicating client-side or throttling degradation.",
      metric: new cloudwatch.Metric({
        namespace: "AWS/ApiGateway",
        metricName: "4xx",
        dimensionsMap: apiDimensions,
        period: metricPeriod,
        statistic: "sum",
      }),
      threshold: props.api4xxThreshold,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
      comparisonOperator:
        cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
    });
    api4xxAlarm.addAlarmAction(alarmAction);

    const successfulSubmissionsMetric = new cloudwatch.Metric({
      namespace: props.successMetricNamespace,
      metricName: "SuccessfulSubmissions",
      dimensionsMap: {
        Service: "SubmissionApi",
      },
      period: metricPeriod,
      statistic: "sum",
    });

    const lambdaInvocationsMetric = props.submissionFunction.metricInvocations({
      period: metricPeriod,
      statistic: "sum",
    });

    const noSuccessfulSubmissionsMetric = new cloudwatch.MathExpression({
      expression: "IF(invocations > 0, successes, 1)",
      usingMetrics: {
        invocations: lambdaInvocationsMetric,
        successes: successfulSubmissionsMetric,
      },
      period: metricPeriod,
      label: "Submission API success health signal",
    });

    const noSuccessfulSubmissionsAlarm = new cloudwatch.Alarm(
      this,
      "NoSuccessfulSubmissionsAlarm",
      {
        alarmName: `${props.alarmPrefix}-no-successful-submissions`,
        alarmDescription:
          "Submission API has traffic but no successful submissions for the configured window.",
        metric: noSuccessfulSubmissionsMetric,
        threshold: 1,
        evaluationPeriods: props.noSuccessEvaluationPeriods,
        datapointsToAlarm: props.noSuccessEvaluationPeriods,
        treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
        comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      },
    );
    noSuccessfulSubmissionsAlarm.addAlarmAction(alarmAction);

    const isSlackConfigured =
      props.slackWorkspaceId.length > 0 && props.slackChannelId.length > 0;

    if (isSlackConfigured === true) {
      new chatbot.SlackChannelConfiguration(
        this,
        "SubmissionAlertsSlackChannel",
        {
          slackChannelConfigurationName: `${props.alarmPrefix}-alerts`,
          slackWorkspaceId: props.slackWorkspaceId,
          slackChannelId: props.slackChannelId,
          notificationTopics: [this.alertTopic],
          loggingLevel: chatbot.LoggingLevel.ERROR,
        },
      );
    }

    new CfnOutput(this, "SubmissionAlertTopicArn", {
      value: this.alertTopic.topicArn,
    });

    new CfnOutput(this, "SlackIntegrationConfigured", {
      value: String(isSlackConfigured),
      description:
        "Set to true when SLACK_WORKSPACE_ID and SLACK_CHANNEL_ID are provided.",
    });
  }
}
