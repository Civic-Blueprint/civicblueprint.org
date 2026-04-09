import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { ManageAnalyticsConsentButton } from "@/components/ManageAnalyticsConsentButton";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Privacy Policy | Civic Blueprint",
  description:
    "How Civic Blueprint uses analytics data, optional cookies, and interaction data to improve public documentation.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Civic Blueprint",
    description:
      "How Civic Blueprint uses analytics data, optional cookies, and interaction data to improve public documentation.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Civic Blueprint",
    description:
      "How Civic Blueprint uses analytics data, optional cookies, and interaction data to improve public documentation.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="section-shell flex-1">
        <div className="container-shell">
          <article className="blueprint-card prose-blueprint max-w-none p-6 md:p-8">
            <h1>Privacy policy</h1>
            <p>
              Civic Blueprint is a public-interest project. We only collect data
              that helps us understand whether people can find, read, and use
              this work. We do not use analytics for advertising or profiling.
            </p>

            <h2>What we collect and why</h2>
            <h3>Plausible Analytics (always on, no cookies)</h3>
            <p>
              We use Plausible for anonymous traffic analytics. This includes
              page URLs, referrer source, browser, operating system, device
              type, country-level location, and visit duration metrics such as
              time on page.
            </p>
            <p>
              We use this data to see which pages are read, where readers drop
              off, and which channels bring useful readers to the site.
            </p>

            <h3>Microsoft Clarity (optional, consent required)</h3>
            <p>
              If you opt in, we load Microsoft Clarity to collect interaction
              data such as clicks, scroll depth, and anonymized session
              recordings.
            </p>
            <p>
              We use this interactive data to improve readability, structure,
              and navigation, such as identifying unclear sections or places
              where readers repeatedly stall.
            </p>

            <h2>What we do not collect</h2>
            <ul>
              <li>We do not collect names or email addresses for analytics.</li>
              <li>We do not build advertising audiences.</li>
              <li>We do not perform cross-site behavioral tracking.</li>
              <li>We do not sell analytics data.</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Plausible does not use cookies. Clarity uses first-party cookies
              only when you choose to accept optional cookies.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Service</th>
                  <th>Purpose</th>
                  <th>Typical duration</th>
                  <th>Scope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>_clck</code>
                  </td>
                  <td>Microsoft Clarity</td>
                  <td>Stores Clarity user identifier and preferences.</td>
                  <td>Up to 1 year</td>
                  <td>First-party</td>
                </tr>
                <tr>
                  <td>
                    <code>_clsk</code>
                  </td>
                  <td>Microsoft Clarity</td>
                  <td>Connects multiple page views into one session record.</td>
                  <td>Up to 1 day</td>
                  <td>First-party</td>
                </tr>
                <tr>
                  <td>
                    <code>CLID</code>
                  </td>
                  <td>Microsoft Clarity</td>
                  <td>Identifies the first time Clarity saw this browser.</td>
                  <td>Up to 1 year</td>
                  <td>Third-party</td>
                </tr>
                <tr>
                  <td>
                    <code>MUID</code>
                  </td>
                  <td>Microsoft</td>
                  <td>Microsoft browser identifier for Clarity telemetry.</td>
                  <td>Up to 1 year</td>
                  <td>Third-party</td>
                </tr>
              </tbody>
            </table>

            <h2>Your choices</h2>
            <p>
              You can manage Clarity cookie consent at any time. Your choice
              only affects optional Clarity cookies and session analytics.
            </p>
            <p>
              <ManageAnalyticsConsentButton />
            </p>
            <p>
              You can also clear site data in your browser settings to remove
              existing cookies.
            </p>

            <h2>Data retention</h2>
            <ul>
              <li>
                Plausible: aggregate and anonymous analytics retained by
                Plausible according to your account configuration.
              </li>
              <li>
                Clarity: session and heatmap data retained by Microsoft Clarity
                (typically up to 30 days).
              </li>
            </ul>

            <h2>Third-party services</h2>
            <ul>
              <li>
                <a
                  href="https://plausible.io/data-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Plausible data policy
                </a>
              </li>
              <li>
                <a
                  href="https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data"
                  target="_blank"
                  rel="noreferrer"
                >
                  Microsoft Clarity data and privacy
                </a>
              </li>
            </ul>

            <h2>Children&apos;s privacy</h2>
            <p>
              This website is not directed to children under 13, and we do not
              knowingly collect personal data from children.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this page when our analytics tooling or data
              practices change. The revision date below reflects the latest
              update.
            </p>
            <p>Last updated: April 9, 2026</p>

            <h2>Contact</h2>
            <p>
              Questions about this policy can be submitted through{" "}
              <Link href="/respond">/respond</Link>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
