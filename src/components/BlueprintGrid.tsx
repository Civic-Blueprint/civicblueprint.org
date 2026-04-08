type BlueprintGridProps = {
  className?: string;
};

export function BlueprintGrid({ className }: BlueprintGridProps) {
  const resolvedClassName = className ?? "";

  return (
    <div
      aria-hidden="true"
      className={`blueprint-grid pointer-events-none absolute inset-0 ${resolvedClassName}`}
    />
  );
}
