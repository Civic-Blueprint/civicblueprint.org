import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blueprint: {
          navy: "#123E7C",
          technical: "#2B5A96",
          surface: "#F7F4EF",
          line: "#C7D2E3",
        },
        ink: "#111827",
        slate: "#334155",
        muted: "#64748B",
        soft: "#E5E7EB",
      },
      boxShadow: {
        panel: "0 1px 2px rgba(17, 24, 39, 0.05)",
      },
      maxWidth: {
        reading: "75ch",
      },
      fontFamily: {
        sans: ["var(--font-public-sans)"],
        display: ["var(--font-source-serif)"],
      },
    },
  },
  plugins: [],
};

export default config;
