"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type ResponseType =
  | "challenge"
  | "domain-expertise"
  | "historical-case"
  | "missing-perspective";

type SubmitState = "idle" | "submitting" | "success" | "error";
type SubmitSuccessBody = {
  success: true;
  issueUrl?: string;
};

const responseTypeOptions: Array<{ label: string; value: ResponseType }> = [
  { label: "Challenge the directional claim", value: "challenge" },
  { label: "Share domain expertise", value: "domain-expertise" },
  { label: "Point to a historical case", value: "historical-case" },
  { label: "Suggest a missing perspective", value: "missing-perspective" },
];

function isResponseType(value: string): value is ResponseType {
  return (
    value === "challenge" ||
    value === "domain-expertise" ||
    value === "historical-case" ||
    value === "missing-perspective"
  );
}

function resolveSubmitUrl(apiBaseUrl: string): string {
  if (apiBaseUrl.endsWith("/")) {
    return `${apiBaseUrl}submit-response`;
  }
  return `${apiBaseUrl}/submit-response`;
}

export function ResponseForm() {
  const searchParams = useSearchParams();
  const apiBaseUrl = process.env.NEXT_PUBLIC_SUBMISSION_API_URL ?? "";
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [selectedResponseType, setSelectedResponseType] =
    useState<ResponseType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdIssueUrl, setCreatedIssueUrl] = useState<string | null>(null);

  const queryTypeValue = searchParams.get("type");
  const queryResponseType =
    typeof queryTypeValue === "string" && isResponseType(queryTypeValue)
      ? queryTypeValue
      : null;
  const responseType = selectedResponseType ?? queryResponseType ?? "challenge";

  const isApiConfigured = apiBaseUrl.trim().length > 0;
  const submitUrl = useMemo(() => resolveSubmitUrl(apiBaseUrl), [apiBaseUrl]);

  useEffect(() => {
    if (queryResponseType !== null) {
      nameInputRef.current?.focus();
    }
  }, [queryResponseType]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isApiConfigured === false) {
      setSubmitState("error");
      setErrorMessage("Submission API is not configured yet.");
      return;
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 20) {
      setSubmitState("error");
      setErrorMessage(
        "Please add at least 20 characters so the response is actionable.",
      );
      return;
    }

    setSubmitState("submitting");
    setErrorMessage("");
    setCreatedIssueUrl(null);

    const payload = {
      responseType,
      name: name.trim(),
      email: email.trim(),
      message: trimmedMessage,
      honeypot,
    };

    try {
      const result = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (result.ok === false) {
        const errorBody = (await result.json().catch(() => null)) as {
          error?: string;
        } | null;
        const fallbackMessage = "Unable to submit right now. Please try again.";
        setSubmitState("error");
        setErrorMessage(errorBody?.error ?? fallbackMessage);
        return;
      }

      const successBody = (await result
        .json()
        .catch(() => null)) as SubmitSuccessBody | null;
      const issueUrl =
        typeof successBody?.issueUrl === "string" &&
        successBody.issueUrl.length > 0
          ? successBody.issueUrl
          : null;

      setSubmitState("success");
      setCreatedIssueUrl(issueUrl);
      setName("");
      setEmail("");
      setMessage("");
      setHoneypot("");
    } catch {
      setSubmitState("error");
      setErrorMessage("Network error. Please try again in a minute.");
    }
  }

  return (
    <section id="response-form" className="blueprint-card p-6 md:p-8">
      <h2 className="section-title mb-3 text-ink">Submit a response</h2>
      <p className="mb-6 leading-relaxed text-slate">
        This form creates a GitHub issue in the project tracker, even if you do
        not use GitHub directly.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            Response type
          </span>
          <select
            className="w-full rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm text-ink"
            value={responseType}
            onChange={(event) => {
              const nextValue = event.target.value;
              if (isResponseType(nextValue)) {
                setSelectedResponseType(nextValue);
              }
            }}
          >
            {responseTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            Name (optional)
          </span>
          <input
            ref={nameInputRef}
            type="text"
            autoComplete="name"
            className="w-full rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm text-ink"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            Email (optional)
          </span>
          <input
            type="email"
            autoComplete="email"
            className="w-full rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm text-ink"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-ink">
            Message
          </span>
          <textarea
            className="min-h-44 w-full rounded-md border border-blueprint-line bg-white px-3 py-2 text-sm text-ink"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
        </label>

        <label className="hidden" aria-hidden="true">
          <span>Website</span>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="primary-button"
            disabled={submitState === "submitting" || isApiConfigured === false}
          >
            {submitState === "submitting" ? "Submitting..." : "Submit response"}
          </button>
          {submitState === "success" ? (
            <div className="space-y-2 text-sm text-emerald-700">
              <p>Your response has been recorded. Thank you.</p>
              {createdIssueUrl !== null ? (
                <a
                  href={createdIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="secondary-button text-sm"
                >
                  View the created GitHub issue
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        {submitState === "error" ? (
          <p className="text-sm text-red-700">{errorMessage}</p>
        ) : null}
        {isApiConfigured === false ? (
          <p className="text-sm text-muted">
            Submission API URL is not configured. Set
            `NEXT_PUBLIC_SUBMISSION_API_URL` during build.
          </p>
        ) : null}
      </form>
    </section>
  );
}
