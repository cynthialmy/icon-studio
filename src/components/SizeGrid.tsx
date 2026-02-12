import React from "react";
import IconCanvas from "./IconCanvas";

interface SizeGridProps {
  appName: string;
  variant: "logo" | "name";
  mode: "light" | "dark";
  platform: "ios" | "android";
}

const iosSizes = [
  { label: "App Store", size: 1024, display: 96 },
  { label: "180px", size: 180, display: 56 },
  { label: "120px", size: 120, display: 44 },
  { label: "87px", size: 87, display: 36 },
  { label: "60px", size: 60, display: 28 },
  { label: "40px", size: 40, display: 22 },
  { label: "29px", size: 29, display: 18 },
];

const androidSizes = [
  { label: "Play Store", size: 512, display: 96 },
  { label: "Adaptive FG", size: 432, display: 64 },
  { label: "Adaptive BG", size: 432, display: 64 },
  { label: "48dp", size: 48, display: 36 },
  { label: "36dp", size: 36, display: 28 },
  { label: "24dp", size: 24, display: 20 },
];

const SizeGrid: React.FC<SizeGridProps> = ({ appName, variant, mode, platform }) => {
  const sizes = platform === "ios" ? iosSizes : androidSizes;

  return (
    <div className="flex flex-wrap items-end gap-4">
      {sizes.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-2">
          <IconCanvas
            appName={appName}
            variant={variant}
            mode={mode}
            size={s.display}
            borderRadius={platform === "ios" ? "22.37%" : "50%"}
          />
          <div className="text-center">
            <p className="text-xs font-body font-medium text-foreground">{s.size}px</p>
            <p className="text-[10px] font-body text-muted-foreground">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SizeGrid;
