import type { MetadataRoute } from "next";

import { getAllDocs } from "@/lib/content";

const BASE_URL = "https://civicblueprint.org";
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getAllDocs();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/respond`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const docRoutes: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${BASE_URL}${doc.route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...docRoutes];
}
