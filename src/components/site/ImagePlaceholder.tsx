// Tasteful Mediterranean placeholder used when a villa/destination/experience
// has no cover image yet. Rendered as a CSS gradient with a subtle horizon.
export function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`w-full h-full relative ${className}`}
      style={{
        background:
          "linear-gradient(180deg, #cfe3e5 0%, #b7d4d9 45%, #e8d9b6 60%, #d9c393 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(60% 40% at 70% 30%, rgba(255,255,255,0.7), transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" style={{ top: "58%" }} />
    </div>
  );
}
