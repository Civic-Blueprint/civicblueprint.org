"use client";

import { useEffect, useState } from "react";

import Script from "next/script";

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
} from "@/lib/analyticsConsent";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() ?? "";
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim() ?? "";
const productionHostnames = new Set([
  "civicblueprint.org",
  "www.civicblueprint.org",
]);

function isAcceptedConsent(value: string | null): boolean {
  return value === "accepted";
}

export function Analytics() {
  const [isClarityEnabled, setIsClarityEnabled] = useState<boolean>(false);
  const [isProductionHost, setIsProductionHost] = useState<boolean>(false);

  useEffect(() => {
    const syncConsent = () => {
      const storedConsent = window.localStorage.getItem(
        ANALYTICS_CONSENT_STORAGE_KEY,
      );
      setIsClarityEnabled(isAcceptedConsent(storedConsent));
    };
    const hostname = window.location.hostname.toLowerCase();
    setIsProductionHost(productionHostnames.has(hostname));

    syncConsent();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, syncConsent);

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, syncConsent);
    };
  }, []);

  const shouldLoadPlausible = isProductionHost && plausibleDomain.length > 0;
  const shouldLoadClarity =
    isProductionHost && clarityProjectId.length > 0 && isClarityEnabled;

  return (
    <>
      {shouldLoadPlausible ? (
        <Script
          id="plausible-analytics"
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
      {shouldLoadClarity ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityProjectId}");`}
        </Script>
      ) : null}
    </>
  );
}
