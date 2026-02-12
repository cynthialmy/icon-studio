import React from "react";
import IconCanvas from "./IconCanvas";

interface SpecsPanelProps {
  platform: "ios" | "android";
  mode: "light" | "dark";
}

const SpecsPanel: React.FC<SpecsPanelProps> = ({ platform, mode }) => {
  const isIOS = platform === "ios";

  const specs = isIOS
    ? [
        { label: "Format", value: "PNG (no alpha)" },
        { label: "Color Profile", value: "sRGB" },
        { label: "Corner Radius", value: "Auto (Apple mask)" },
        { label: "Max Size", value: "1024×1024 px" },
        { label: "Constraints", value: "No thin strokes, no text < bold" },
      ]
    : [
        { label: "Format", value: "32-bit PNG" },
        { label: "Max File Size", value: "1024 KB" },
        { label: "Play Store", value: "512×512 px" },
        { label: "Adaptive Layers", value: "432×432 px (FG + BG)" },
        { label: "Safe Zone", value: "72×72 dp core" },
      ];

  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="font-display font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
        {isIOS ? "🍎" : "🤖"} {isIOS ? "iOS" : "Android"} Specs — {mode === "light" ? "Light" : "Dark"} Mode
      </h3>
      <div className="space-y-2">
        {specs.map((s) => (
          <div key={s.label} className="flex justify-between text-xs font-body">
            <span className="text-muted-foreground">{s.label}</span>
            <span className="text-foreground font-medium">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecsPanel;
