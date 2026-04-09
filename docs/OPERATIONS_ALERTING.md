# Operations Alerting

This document defines operational alerting for the Civic Blueprint submission API.

## Scope

Alerting covers the response submission path:

- API Gateway HTTP API route: `POST /submit-response`
- Lambda function: `SubmissionHandler`
- GitHub issue creation success signal emitted by Lambda

## Notification path

- CloudWatch Alarms -> SNS Topic (`civic-blueprint-submission-api-alerts`) -> AWS Chatbot -> Slack

If Slack is not configured yet, alarms and SNS still work; Slack delivery is enabled once `SLACK_WORKSPACE_ID` and `SLACK_CHANNEL_ID` are set and deployed.

## Alarm catalog

### Critical alerts

- `civic-blueprint-submission-api-lambda-errors`
  - Metric: Lambda `Errors` (sum, 5m)
  - Alarm: >= 1 in 1 period

- `civic-blueprint-submission-api-lambda-timeout-likely`
  - Metric: Lambda `Duration` (max, 5m)
  - Alarm: >= `14500` ms in 1 period
  - Purpose: early warning before hard timeout at 15s

- `civic-blueprint-submission-api-api-5xx`
  - Metric: API Gateway `5xx` (sum, 5m)
  - Alarm: >= 1 in 1 period

### Degradation alerts

- `civic-blueprint-submission-api-lambda-throttles`
  - Metric: Lambda `Throttles` (sum, 5m)
  - Alarm: >= 1 in 1 period

- `civic-blueprint-submission-api-lambda-high-duration`
  - Metric: Lambda `Duration` (p95, 5m)
  - Alarm: >= `12000` ms for 2 of 3 periods

- `civic-blueprint-submission-api-api-4xx-burst`
  - Metric: API Gateway `4xx` (sum, 5m)
  - Alarm: >= `20` in 1 period

### Submission health signal

- `civic-blueprint-submission-api-no-successful-submissions`
  - Metric math: `IF(invocations > 0, successes, 1)`
  - Inputs:
    - `invocations`: Lambda `Invocations` (sum, 5m)
    - `successes`: custom metric `SuccessfulSubmissions` in namespace `CivicBlueprint/SubmissionApi`
  - Alarm: value < 1 for `12` consecutive periods (default 1 hour)
  - Behavior:
    - No traffic: does not alarm
    - Traffic present + zero successful submissions: alarms

## Triage runbook

1. Open CloudWatch alarm details and confirm state transition reason.
2. Check latest Lambda logs (`/aws/lambda/...SubmissionHandler...`) for stack traces and request IDs.
3. Validate GitHub App installation access and permissions if issue creation fails.
4. Submit a synthetic request to `/submit-response` and verify:
   - API returns success
   - New issue appears in `Civic-Blueprint/project-2028`
5. Confirm alarm recovery to `OK`.

## Deployment checklist

1. Set optional Slack env vars in deploy environment:
   - `SLACK_WORKSPACE_ID`
   - `SLACK_CHANNEL_ID`
2. Build and deploy infra:
   - `npm run build`
   - `npx cdk deploy CivicBlueprintMonitoring CivicBlueprintSubmissionApi`
3. Verify stack output `SlackIntegrationConfigured` is `true`.
4. Trigger a controlled alarm (in staging preferred) and confirm Slack message delivery.

## Ownership

- Primary owner: dev team maintaining `civicblueprint.org` infrastructure
- Escalation path: infra maintainer on-call or repo admins
