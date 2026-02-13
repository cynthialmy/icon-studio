import React, { useState } from "react";
import { toast } from "@/components/ui/sonner";

interface ControlBarProps {
  appName: string;
  setAppName: (v: string) => void;
  variant: "logo" | "name";
  setVariant: (v: "logo" | "name") => void;
  mode: "light" | "dark";
  setMode: (v: "light" | "dark") => void;
  platform: "ios" | "android";
  setPlatform: (v: "ios" | "android") => void;
  onExport?: () => Promise<void>;
}

const ToggleButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium font-body rounded-lg transition-all duration-200 ${
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    }`}
  >
    {children}
  </button>
);

const ControlBar: React.FC<ControlBarProps> = ({
  appName,
  setAppName,
  variant,
  setVariant,
  mode,
  setMode,
  platform,
  setPlatform,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!onExport) return;
    setIsExporting(true);
    try {
      await onExport();
      toast.success(`Downloaded ${appName}-icons.zip`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export assets. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 flex flex-wrap items-center gap-5">
      {/* App Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
          App Name
        </label>
        <input
          type="text"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="bg-secondary text-foreground font-body text-sm rounded-lg px-3 py-2 w-40 border border-border focus:outline-none focus:ring-2 focus:ring-ring/40 transition-all"
          placeholder="My App"
          maxLength={12}
        />
      </div>

      {/* Variant */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
          Variant
        </label>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <ToggleButton active={variant === "logo"} onClick={() => setVariant("logo")}>
            Logo
          </ToggleButton>
          <ToggleButton active={variant === "name"} onClick={() => setVariant("name")}>
            Name
          </ToggleButton>
        </div>
      </div>

      {/* Mode */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
          Mode
        </label>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <ToggleButton active={mode === "light"} onClick={() => setMode("light")}>
            ☀️ Light
          </ToggleButton>
          <ToggleButton active={mode === "dark"} onClick={() => setMode("dark")}>
            🌙 Dark
          </ToggleButton>
        </div>
      </div>

      {/* Platform */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
          Platform
        </label>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <ToggleButton active={platform === "ios"} onClick={() => setPlatform("ios")}>
             iOS
          </ToggleButton>
          <ToggleButton active={platform === "android"} onClick={() => setPlatform("android")}>
             Android
          </ToggleButton>
        </div>
      </div>

      {/* Export Button */}
      {onExport && (
        <div className="flex flex-col gap-1.5 ml-auto">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-6 py-2 text-sm font-medium font-body rounded-lg transition-all duration-200 ${
              isExporting
                ? "bg-secondary text-secondary-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90"
            }`}
          >
            {isExporting ? "Exporting..." : "📦 Export Assets"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlBar;
