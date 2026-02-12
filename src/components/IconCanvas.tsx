import React from "react";

interface IconCanvasProps {
  appName: string;
  variant: "logo" | "name";
  mode: "light" | "dark";
  size?: number;
  borderRadius?: string;
  showMask?: boolean;
}

const IconCanvas: React.FC<IconCanvasProps> = ({
  appName,
  variant,
  mode,
  size = 200,
  borderRadius = "22.37%",
  showMask = false,
}) => {
  const isLight = mode === "light";
  const initials = appName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="relative overflow-hidden flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: showMask ? borderRadius : borderRadius,
        background: isLight
          ? "linear-gradient(135deg, hsl(220 70% 55%), hsl(260 60% 58%))"
          : "linear-gradient(135deg, hsl(225 30% 16%), hsl(260 25% 22%))",
        boxShadow: isLight
          ? "inset 0 1px 3px hsl(0 0% 100% / 0.35), inset 0 -1px 3px hsl(0 0% 0% / 0.1), 0 6px 24px hsl(220 70% 50% / 0.2)"
          : "inset 0 1px 2px hsl(0 0% 100% / 0.08), inset 0 -1px 3px hsl(0 0% 0% / 0.3), 0 6px 24px hsl(0 0% 0% / 0.35)",
      }}
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? "linear-gradient(180deg, hsl(0 0% 100% / 0.25) 0%, transparent 50%, hsl(0 0% 0% / 0.05) 100%)"
            : "linear-gradient(180deg, hsl(0 0% 100% / 0.06) 0%, transparent 50%, hsl(0 0% 0% / 0.15) 100%)",
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "8%",
          left: "15%",
          right: "15%",
          height: "35%",
          borderRadius: "50%",
          background: isLight
            ? "radial-gradient(ellipse, hsl(0 0% 100% / 0.2), transparent)"
            : "radial-gradient(ellipse, hsl(220 70% 70% / 0.08), transparent)",
          filter: "blur(8px)",
        }}
      />

      {variant === "logo" ? (
        <div className="relative z-10 flex items-center justify-center" style={{ width: size * 0.55, height: size * 0.55 }}>
          {/* Abstract geometric logo mark */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id={`logo-grad-${mode}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={isLight ? "hsl(0,0%,100%)" : "hsl(220,80%,75%)"} />
                <stop offset="100%" stopColor={isLight ? "hsl(0,0%,90%)" : "hsl(260,60%,70%)"} />
              </linearGradient>
            </defs>
            {/* Rounded square with cutout */}
            <rect
              x="18" y="18" width="64" height="64" rx="16"
              fill="none"
              stroke={`url(#logo-grad-${mode})`}
              strokeWidth="5"
              opacity="0.9"
            />
            <circle
              cx="50" cy="50" r="16"
              fill={`url(#logo-grad-${mode})`}
              opacity="0.95"
            />
            <rect
              x="42" y="20" width="16" height="16" rx="4"
              fill={`url(#logo-grad-${mode})`}
              opacity="0.6"
            />
          </svg>
        </div>
      ) : (
        <div className="relative z-10 text-center px-2">
          <span
            className="font-display font-bold tracking-tight leading-none block"
            style={{
              fontSize: size * 0.22,
              color: isLight ? "hsl(0,0%,100%)" : "hsl(220,20%,90%)",
              textShadow: isLight
                ? "0 1px 2px hsl(0 0% 0% / 0.15)"
                : "0 1px 3px hsl(0 0% 0% / 0.4)",
            }}
          >
            {appName.length <= 6 ? appName : initials}
          </span>
        </div>
      )}
    </div>
  );
};

export default IconCanvas;
