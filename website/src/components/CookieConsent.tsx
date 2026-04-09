"use client";

import { useEffect, useState } from "react";

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  OPEN_ANALYTICS_CONSENT_EVENT,
  type AnalyticsConsentValue,
} from "@/lib/analyticsConsent";

function isStoredConsent(value: string | null): value is AnalyticsConsentValue {
  return value === "accepted" || value === "declined";
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(
      ANALYTICS_CONSENT_STORAGE_KEY,
    );
    const hasExistingConsent = isStoredConsent(storedValue);
    setIsVisible(hasExistingConsent === false);

    const showConsentBanner = () => {
      setIsVisible(true);
    };

    window.addEventListener(OPEN_ANALYTICS_CONSENT_EVENT, showConsentBanner);

    return () => {
      window.removeEventListener(
        OPEN_ANALYTICS_CONSENT_EVENT,
        showConsentBanner,
      );
    };
  }, []);

  const handleConsent = (value: AnalyticsConsentValue) => {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
    setIsVisible(false);
  };

  if (isVisible === false) {
    return null;
  }

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-50 border-t border-blueprint-line bg-white/98 shadow-[0_-1px_8px_rgba(17,24,39,0.1)] backdrop-blur"
      aria-live="polite"
    >
      <div className="container-shell py-4">
        <p className="text-sm leading-relaxed text-slate">
          We use Plausible for anonymous, cookie-free analytics to understand
          which pages people read. We also offer optional Microsoft Clarity
          session analytics, which uses cookies, to understand click and scroll
          behavior so we can improve readability.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              handleConsent("accepted");
            }}
          >
            Accept optional cookies
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              handleConsent("declined");
            }}
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
