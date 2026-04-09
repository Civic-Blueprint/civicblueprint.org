export type DeploymentEnvironment = "staging" | "production";

function numberFromEnv(variableName: string, fallbackValue: number): number {
  const rawValue = process.env[variableName];
  if (typeof rawValue !== "string" || rawValue.length === 0) {
    return fallbackValue;
  }

  const parsedValue = Number.parseFloat(rawValue);
  if (Number.isFinite(parsedValue) === false || parsedValue <= 0) {
    return fallbackValue;
  }

  return parsedValue;
}

export const config = {
  account:
    process.env.CDK_DEFAULT_ACCOUNT ??
    process.env.AWS_ACCOUNT_ID ??
    "932027117408",
  region: process.env.CDK_DEFAULT_REGION ?? "us-east-1",
  domainName: process.env.DOMAIN_NAME ?? "civicblueprint.org",
  githubOrg: process.env.GITHUB_ORG ?? "Civic-Blueprint",
  githubRepo: process.env.GITHUB_REPO ?? "civicblueprint.org",
  monitoring: {
    alarmPrefix:
      process.env.SUBMISSION_ALERT_ALARM_PREFIX ??
      "civic-blueprint-submission-api",
    successMetricNamespace:
      process.env.SUBMISSION_METRIC_NAMESPACE ?? "CivicBlueprint/SubmissionApi",
    slackWorkspaceId: process.env.SLACK_WORKSPACE_ID ?? "",
    slackChannelId: process.env.SLACK_CHANNEL_ID ?? "",
    lambdaHighDurationMsThreshold: numberFromEnv(
      "SUBMISSION_LAMBDA_HIGH_DURATION_MS",
      12000,
    ),
    lambdaTimeoutLikelyMsThreshold: numberFromEnv(
      "SUBMISSION_LAMBDA_TIMEOUT_LIKELY_MS",
      14500,
    ),
    api4xxThreshold: numberFromEnv("SUBMISSION_API_4XX_THRESHOLD", 20),
    noSuccessEvaluationPeriods: Math.floor(
      numberFromEnv("SUBMISSION_NO_SUCCESS_EVALUATION_PERIODS", 12),
    ),
  },
} as const;
