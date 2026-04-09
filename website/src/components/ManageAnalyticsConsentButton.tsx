"use client";

import { OPEN_ANALYTICS_CONSENT_EVENT } from "@/lib/analyticsConsent";

export function ManageAnalyticsConsentButton() {
  return (
    <button
      type="button"
      className="secondary-button"
      onClick={() => {
        window.dispatchEvent(new Event(OPEN_ANALYTICS_CONSENT_EVENT));
      }}
    >
      Review cookie choices
    </button>
  );
}
