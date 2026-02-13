import React, { useMemo } from "react";
import { generateDesignSpec, DesignSpec, hslColor, getGradientStops } from "@/lib/designGenerator";
import { renderDesignStyle } from "@/lib/designStyles";

interface IconCanvasProps {
  appName: string;
  variant: "logo" | "name";
  mode: "light" | "dark";
  size?: number;
  borderRadius?: string;
  showMask?: boolean;
  designSpec?: DesignSpec; // Optional - will generate if not provided
}

const IconCanvas: React.FC<IconCanvasProps> = ({
  appName,
  variant,
  mode,
  size = 200,
  borderRadius = "22.37%",
  showMask = false,
  designSpec: providedSpec,
}) => {
  // Generate or use provided design spec
  const designSpec = useMemo(() => {
    return providedSpec || generateDesignSpec(appName);
  }, [appName, providedSpec]);

  // Use getIconSvgString to generate the SVG

  // Build complete SVG string for rendering
  const fullSvgString = getIconSvgString(appName, variant, mode, size, borderRadius, designSpec);

  // For display, render SVG using dangerouslySetInnerHTML
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: showMask ? borderRadius : borderRadius,
        overflow: 'hidden',
        display: 'inline-block',
      }}
      dangerouslySetInnerHTML={{ __html: fullSvgString }}
    />
  );
};

/**
 * Export function to get SVG string for export
 */
export function getIconSvgString(
  appName: string,
  variant: "logo" | "name",
  mode: "light" | "dark",
  size: number,
  borderRadius: string,
  designSpec?: DesignSpec
): string {
  const spec = designSpec || generateDesignSpec(appName);
  const isLight = mode === "light";
  const initials = appName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stops = getGradientStops(spec, mode);
  const bgGradientId = `bg-grad-${spec.seed}-${mode}`;
  const shadowColor = isLight
    ? hslColor(spec.primaryHue, spec.saturation, spec.lightness * 0.3)
    : hslColor(spec.primaryHue, spec.saturation, spec.darkLightness * 0.5);

  let foregroundContent = "";
  if (variant === "logo") {
    foregroundContent = renderDesignStyle(spec, size, mode, appName);
  } else {
    const textColor = isLight ? "hsl(0, 0%, 100%)" : "hsl(220, 20%, 90%)";
    const fontSize = size * 0.4; // Font size relative to icon size
    const displayText = appName.length <= 6 ? appName : initials;
    const textGradientId = `text-grad-${spec.seed}-${mode}`;
    foregroundContent = `
      <defs>
        <linearGradient id="${textGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${textColor}" />
          <stop offset="100%" stop-color="${isLight ? 'hsl(0, 0%, 95%)' : 'hsl(220, 20%, 85%)'}" />
        </linearGradient>
      </defs>
      <text 
        x="0" 
        y="0" 
        font-family="system-ui, -apple-system, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="url(#${textGradientId})" 
        text-anchor="middle" 
        dominant-baseline="central"
        style="filter: drop-shadow(0 1px 2px rgba(0,0,0,${isLight ? 0.15 : 0.4}));"
      >${displayText}</text>
    `;
  }

  const borderRadiusValue = borderRadius === "22.37%" 
    ? size * 0.2237 
    : borderRadius === "50%" 
    ? size * 0.5 
    : parseFloat(borderRadius) || 0;

  return `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 ${size} ${size}" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="${bgGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${stops[0]}" />
          <stop offset="100%" stop-color="${stops[1]}" />
        </linearGradient>
        <linearGradient id="glass-overlay-${spec.seed}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${isLight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)'}" />
          <stop offset="50%" stop-color="transparent" />
          <stop offset="100%" stop-color="${isLight ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.15)'}" />
        </linearGradient>
        <radialGradient id="inner-glow-${spec.seed}">
          <stop offset="0%" stop-color="${isLight ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}" />
          <stop offset="100%" stop-color="transparent" />
        </radialGradient>
      </defs>
      
      <rect 
        width="${size}" 
        height="${size}" 
        rx="${borderRadiusValue}" 
        fill="url(#${bgGradientId})"
        style="filter: drop-shadow(0 6px 24px ${shadowColor}40);"
      />
      
      <rect 
        width="${size}" 
        height="${size}" 
        rx="${borderRadiusValue}" 
        fill="url(#glass-overlay-${spec.seed})"
      />
      
      <ellipse 
        cx="${size * 0.5}" 
        cy="${size * 0.15}" 
        rx="${size * 0.35}" 
        ry="${size * 0.15}" 
        fill="url(#inner-glow-${spec.seed})"
        style="filter: blur(8px);"
      />
      
      <g transform="translate(${size * 0.5}, ${size * 0.5})">
        ${foregroundContent}
      </g>
    </svg>
  `;
}

export default IconCanvas;
