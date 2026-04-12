import { ImageResponse } from "next/og";

import { OG_IMAGE_SIZE, OgImageCard } from "@/lib/og-image";

export const alt = "Civic Blueprint";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    <OgImageCard
      title="Civic Blueprint"
      description="A public framework for redesigning broken systems."
      label="Public Framework"
    />,
    size,
  );
}
