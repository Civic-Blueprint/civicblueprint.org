export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

type OgImageCardProps = {
  title: string;
  description: string;
  label: string;
};

export function OgImageCard({ title, description, label }: OgImageCardProps) {
  return (
    <div
      style={{
        alignItems: "stretch",
        background:
          "linear-gradient(135deg, #08111f 0%, #0f2136 45%, #18324f 100%)",
        color: "#f8fbff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "54px 58px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: "18px",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(159, 215, 252, 0.65)",
            borderRadius: "9999px",
            color: "#9fd7fc",
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.06em",
            padding: "10px 16px",
            textTransform: "uppercase",
          }}
        >
          Civic Blueprint
        </div>
        <div
          style={{
            border: "1px solid rgba(159, 215, 252, 0.45)",
            borderRadius: "9999px",
            color: "#d5edff",
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "8px 14px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          maxWidth: "1040px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#d9e8f4",
            display: "flex",
            fontSize: 33,
            fontWeight: 500,
            lineHeight: 1.25,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
