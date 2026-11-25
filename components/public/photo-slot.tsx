export type SlotTone = "pine" | "olive-dark" | "umber" | "sand" | "clay" | "chalk" | "olive";

export function PhotoSlot({
  caption,
  tone,
  className = "",
}: {
  caption: string;
  tone: SlotTone;
  className?: string;
}) {
  return (
    <span className={`photo-slot ${className}`} data-tone={tone}>
      <span className="photo-slot__frame" aria-hidden="true" />
      <span className="photo-slot__label">{caption}</span>
    </span>
  );
}
