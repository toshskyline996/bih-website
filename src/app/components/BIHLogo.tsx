interface BIHLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light" | "outline";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-16 h-16", text: "text-[28px]", sub: "text-[5px]", bar: "h-[1.5px]", gap: "gap-[2px]" },
  md: { container: "w-24 h-24", text: "text-[42px]", sub: "text-[7px]", bar: "h-[2px]", gap: "gap-[3px]" },
  lg: { container: "w-36 h-36", text: "text-[64px]", sub: "text-[10px]", bar: "h-[2.5px]", gap: "gap-[4px]" },
  xl: { container: "w-56 h-56", text: "text-[100px]", sub: "text-[15px]", bar: "h-[3px]", gap: "gap-[6px]" },
};

export function BIHLogo({ size = "md", variant = "dark", className = "" }: BIHLogoProps) {
  const s = sizeMap[size];

  const textColor =
    variant === "dark" ? "text-[#1a1a1a]" : variant === "light" ? "text-white" : "text-transparent";
  const borderColor =
    variant === "dark" ? "border-[#1a1a1a]" : variant === "light" ? "border-white" : "border-[#1a1a1a]";
  const barColor =
    variant === "dark" ? "bg-[#1a1a1a]" : variant === "light" ? "bg-white" : "bg-[#1a1a1a]";
  const strokeStyle =
    variant === "outline"
      ? { WebkitTextStroke: "2px #1a1a1a" }
      : {};

  return (
    <div className={`flex flex-col items-center justify-center ${s.container} ${className}`} style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div className={`w-full ${s.bar} ${barColor} mb-[6px]`} />

      {/* BIH Stencil Letters */}
      <div
        className={`${s.text} ${textColor} tracking-widest uppercase select-none`}
        style={{
          fontWeight: 900,
          letterSpacing: "0.12em",
          lineHeight: 1,
          ...strokeStyle,
        }}
      >
        BIH
      </div>

      {/* Bottom bar */}
      <div className={`w-full ${s.bar} ${barColor} mt-[6px] mb-[5px]`} />

      {/* Subtitle */}
      <div
        className={`${s.sub} ${textColor} tracking-[0.35em] uppercase`}
        style={{ fontWeight: 300, opacity: 0.75 }}
      >
        BOREAL IRON HEAVY
      </div>
    </div>
  );
}

/* ─── Inline SVG logo for nav / small contexts ─── */
export function BIHLogoMark({ color = "#1a1a1a", width = 80 }: { color?: string; width?: number }) {
  const h = Math.round(width * 0.55);
  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 160 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top rule */}
      <rect x="0" y="0" width="160" height="2.5" fill={color} />

      {/* B I H letters */}
      <text
        x="80"
        y="60"
        textAnchor="middle"
        dominantBaseline="auto"
        fill={color}
        fontSize="56"
        fontWeight="900"
        fontFamily="Inter, sans-serif"
        letterSpacing="8"
      >
        BIH
      </text>

      {/* Bottom rule */}
      <rect x="0" y="68" width="160" height="2.5" fill={color} />

      {/* Tagline */}
      <text
        x="80"
        y="84"
        textAnchor="middle"
        fill={color}
        fontSize="8"
        fontWeight="300"
        fontFamily="Inter, sans-serif"
        letterSpacing="4"
        opacity="0.7"
      >
        BOREAL IRON HEAVY
      </text>
    </svg>
  );
}
