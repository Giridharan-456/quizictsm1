export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="blob"
        style={{
          width: 360,
          height: 360,
          top: "-10%",
          left: "-15%",
          background: "var(--blob-a)",
          animationDelay: "0s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 420,
          height: 420,
          bottom: "-15%",
          right: "-20%",
          background: "var(--blob-b)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 260,
          height: 260,
          top: "40%",
          right: "-10%",
          background: "var(--blob-a)",
          opacity: 0.18,
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
