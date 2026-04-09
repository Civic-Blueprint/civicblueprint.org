import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";

type SubmissionType =
  | "challenge"
  | "domain-expertise"
  | "historical-case"
  | "missing-perspective";

type SubmissionPayload = {
  responseType: SubmissionType;
  name?: string;
  email?: string;
  message: string;
  honeypot?: string;
};

type LambdaEvent = {
  body?: string | null;
  headers?: Record<string, string | undefined>;
  requestContext?: {
    http?: {
      method?: string;
    };
  };
};

type LambdaResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

type GitHubAppSecret = {
  appId: string;
  privateKey: string;
};

const secretsClient = new SecretsManagerClient({});
let cachedSecret: GitHubAppSecret | null = null;
let cachedInstallationId: number | null = null;
const submissionMetricNamespace =
  process.env.SUBMISSION_METRIC_NAMESPACE ?? "CivicBlueprint/SubmissionApi";

const submissionTypeConfig: Record<
  SubmissionType,
  { label: string; titlePrefix: string }
> = {
  challenge: {
    label: "challenge",
    titlePrefix: "Challenge",
  },
  "domain-expertise": {
    label: "domain-expertise",
    titlePrefix: "Domain expertise",
  },
  "historical-case": {
    label: "historical-case",
    titlePrefix: "Historical case",
  },
  "missing-perspective": {
    label: "missing-perspective",
    titlePrefix: "Missing perspective",
  },
};

function response(
  statusCode: number,
  data: Record<string, string | boolean>,
  origin: string,
): LambdaResponse {
  return {
    statusCode,
    headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST,OPTIONS",
      "access-control-allow-headers": "content-type",
      "content-type": "application/json; charset=utf-8",
      vary: "Origin",
    },
    body: JSON.stringify(data),
  };
}

function parseAllowedOrigins(): Set<string> {
  const allowedOriginsValue = process.env.ALLOWED_ORIGINS ?? "";
  const origins = allowedOriginsValue
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  return new Set(origins);
}

function resolveOrigin(
  headers: Record<string, string | undefined> | undefined,
  allowedOrigins: Set<string>,
): string {
  const originHeader = headers?.origin ?? headers?.Origin ?? "";
  const isAllowed = allowedOrigins.has(originHeader);
  if (isAllowed === true) {
    return originHeader;
  }

  const firstAllowedOrigin = allowedOrigins.values().next().value;
  if (typeof firstAllowedOrigin === "string" && firstAllowedOrigin.length > 0) {
    return firstAllowedOrigin;
  }

  return "https://civicblueprint.org";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validatePayload(
  value: unknown,
): { ok: true; payload: SubmissionPayload } | { ok: false; error: string } {
  if (isObject(value) === false) {
    return { ok: false, error: "Request body must be an object." };
  }

  const responseTypeRaw = value.responseType;
  const messageRaw = value.message;
  const nameRaw = value.name;
  const emailRaw = value.email;
  const honeypotRaw = value.honeypot;

  const validResponseTypes: SubmissionType[] = [
    "challenge",
    "domain-expertise",
    "historical-case",
    "missing-perspective",
  ];

  if (
    typeof responseTypeRaw !== "string" ||
    validResponseTypes.includes(responseTypeRaw as SubmissionType) === false
  ) {
    return { ok: false, error: "Invalid responseType." };
  }

  if (typeof messageRaw !== "string") {
    return { ok: false, error: "Message is required." };
  }

  const message = messageRaw.trim();
  if (message.length < 20) {
    return { ok: false, error: "Message must be at least 20 characters." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "Message must be 5000 characters or fewer." };
  }

  let name: string | undefined;
  if (typeof nameRaw === "string") {
    const trimmedName = nameRaw.trim();
    if (trimmedName.length > 0 && trimmedName.length <= 120) {
      name = trimmedName;
    }
  }

  let email: string | undefined;
  if (typeof emailRaw === "string") {
    const trimmedEmail = emailRaw.trim();
    if (trimmedEmail.length > 0) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(trimmedEmail) === false) {
        return { ok: false, error: "Email format looks invalid." };
      }
      email = trimmedEmail;
    }
  }

  let honeypot = "";
  if (typeof honeypotRaw === "string") {
    honeypot = honeypotRaw.trim();
  }

  return {
    ok: true,
    payload: {
      responseType: responseTypeRaw as SubmissionType,
      message,
      name,
      email,
      honeypot,
    },
  };
}

function buildIssueTitle(payload: SubmissionPayload): string {
  const config = submissionTypeConfig[payload.responseType];
  const firstLine = payload.message.split("\n")[0]?.trim() ?? "";
  const snippet = firstLine.replace(/\s+/g, " ").slice(0, 80);
  const suffix = snippet.length > 0 ? snippet : "Website submission";
  return `${config.titlePrefix}: ${suffix}`;
}

function buildIssueBody(payload: SubmissionPayload): string {
  const lines = [
    "## Submission source",
    "Submitted via the civicblueprint.org response form.",
    "",
    "## Response type",
    payload.responseType,
    "",
    "## Submitter",
    `- Name: ${payload.name ?? "Not provided"}`,
    `- Email: ${payload.email ?? "Not provided"}`,
    "",
    "## Message",
    payload.message,
  ];
  return lines.join("\n");
}

function emitSubmissionSuccessMetric(payload: SubmissionPayload): void {
  const metricEnvelope = {
    _aws: {
      Timestamp: Date.now(),
      CloudWatchMetrics: [
        {
          Namespace: submissionMetricNamespace,
          Dimensions: [["Service", "ResponseType"]],
          Metrics: [{ Name: "SuccessfulSubmissions", Unit: "Count" }],
        },
      ],
    },
    Service: "SubmissionApi",
    ResponseType: payload.responseType,
    SuccessfulSubmissions: 1,
  };

  // EMF metric emission avoids synchronous CloudWatch API calls in request path.
  console.log(JSON.stringify(metricEnvelope));
}

async function getGithubAppSecret(
  secretName: string,
): Promise<GitHubAppSecret> {
  if (cachedSecret !== null) {
    return cachedSecret;
  }

  const secretResult = await secretsClient.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    }),
  );

  if (typeof secretResult.SecretString !== "string") {
    throw new Error("GitHub app secret must be stored as a JSON SecretString.");
  }

  const parsedSecret = JSON.parse(
    secretResult.SecretString,
  ) as Partial<GitHubAppSecret>;
  if (
    typeof parsedSecret.appId !== "string" ||
    parsedSecret.appId.trim().length === 0 ||
    typeof parsedSecret.privateKey !== "string" ||
    parsedSecret.privateKey.trim().length === 0
  ) {
    throw new Error(
      "GitHub app secret must include appId and privateKey fields.",
    );
  }

  cachedSecret = {
    appId: parsedSecret.appId,
    privateKey: parsedSecret.privateKey,
  };
  return cachedSecret;
}

async function getInstallationId(
  appId: string,
  privateKey: string,
  owner: string,
  repo: string,
): Promise<number> {
  if (cachedInstallationId !== null) {
    return cachedInstallationId;
  }

  const appAuth = createAppAuth({
    appId,
    privateKey,
  });
  const appToken = await appAuth({ type: "app" });
  const appOctokit = new Octokit({ auth: appToken.token });

  const installationResponse = await appOctokit.request(
    "GET /repos/{owner}/{repo}/installation",
    {
      owner,
      repo,
    },
  );

  cachedInstallationId = installationResponse.data.id;
  return cachedInstallationId;
}

async function createIssue(payload: SubmissionPayload): Promise<string> {
  const secretName = process.env.GITHUB_APP_SECRET_NAME ?? "";
  const owner = process.env.GITHUB_OWNER ?? "";
  const repo = process.env.GITHUB_REPO ?? "";

  if (secretName.length === 0 || owner.length === 0 || repo.length === 0) {
    throw new Error(
      "Missing required environment variables: GITHUB_APP_SECRET_NAME, GITHUB_OWNER, GITHUB_REPO.",
    );
  }

  const githubSecret = await getGithubAppSecret(secretName);
  const installationId = await getInstallationId(
    githubSecret.appId,
    githubSecret.privateKey,
    owner,
    repo,
  );

  const appAuth = createAppAuth({
    appId: githubSecret.appId,
    privateKey: githubSecret.privateKey,
  });
  const installationAuth = await appAuth({
    type: "installation",
    installationId,
  });

  const octokit = new Octokit({ auth: installationAuth.token });
  const typeConfig = submissionTypeConfig[payload.responseType];

  const issueResponse = await octokit.request(
    "POST /repos/{owner}/{repo}/issues",
    {
      owner,
      repo,
      title: buildIssueTitle(payload),
      body: buildIssueBody(payload),
      labels: [typeConfig.label, "website-submission"],
    },
  );

  return issueResponse.data.html_url;
}

export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const allowedOrigins = parseAllowedOrigins();
  const origin = resolveOrigin(event.headers, allowedOrigins);

  const method = event.requestContext?.http?.method ?? "";
  if (method === "OPTIONS") {
    return response(200, { success: true }, origin);
  }

  if (method !== "POST") {
    return response(
      405,
      { success: false, error: "Method not allowed." },
      origin,
    );
  }

  if (typeof event.body !== "string") {
    return response(
      400,
      { success: false, error: "Missing JSON body." },
      origin,
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(event.body);
  } catch {
    return response(
      400,
      { success: false, error: "Invalid JSON body." },
      origin,
    );
  }

  const validatedPayload = validatePayload(parsedBody);
  if (validatedPayload.ok === false) {
    return response(
      400,
      { success: false, error: validatedPayload.error },
      origin,
    );
  }

  if (
    typeof validatedPayload.payload.honeypot === "string" &&
    validatedPayload.payload.honeypot.length > 0
  ) {
    return response(200, { success: true }, origin);
  }

  try {
    const issueUrl = await createIssue(validatedPayload.payload);
    emitSubmissionSuccessMetric(validatedPayload.payload);
    return response(200, { success: true, issueUrl }, origin);
  } catch (error) {
    console.error("Submission API failed to create issue", error);
    return response(
      500,
      {
        success: false,
        error: "Unable to create issue right now. Please try again.",
      },
      origin,
    );
  }
}
