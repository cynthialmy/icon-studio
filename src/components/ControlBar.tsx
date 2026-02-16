import React, { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Layers, Shuffle, RotateCw, Grid } from "lucide-react";
import { DesignParams } from "@/lib/designGenerator";

interface ControlBarProps {
  appName: string;
  setAppName: (v: string) => void;
  variant: "logo" | "name";
  setVariant: (v: "logo" | "name") => void;
  mode: "light" | "dark";
  setMode: (v: "light" | "dark") => void;
  platform: "ios" | "android";
  setPlatform: (v: "ios" | "android") => void;
  designParams: DesignParams;
  setDesignParams: (params: DesignParams) => void;
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
  designParams,
  setDesignParams,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="glass-panel-enhanced rounded-3xl p-6 flex flex-wrap items-center gap-6">
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

        {/* Advanced Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
            Expressiveness
          </label>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-2 text-sm font-medium font-body rounded-lg transition-all duration-200 ${
              showAdvanced
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {showAdvanced ? "Hide" : "Show"} Controls
          </button>
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

      {/* Advanced Expressive Controls */}
      {showAdvanced && (
        <div className="glass-panel-enhanced rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">
            🎨 Expressive Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Vibrancy */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <label className="text-xs font-body font-medium text-foreground">
                  Vibrancy: {designParams.vibrancy ?? 50}
                </label>
              </div>
              <Slider
                value={[designParams.vibrancy ?? 50]}
                onValueChange={([value]) => setDesignParams({ ...designParams, vibrancy: value })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Color intensity & saturation</p>
            </div>

            {/* Complexity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <label className="text-xs font-body font-medium text-foreground">
                  Complexity: {designParams.complexity ?? 50}
                </label>
              </div>
              <Slider
                value={[designParams.complexity ?? 50]}
                onValueChange={([value]) => setDesignParams({ ...designParams, complexity: value })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Number of elements & detail</p>
            </div>

            {/* Size Variation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4 text-primary" />
                <label className="text-xs font-body font-medium text-foreground">
                  Size Variation: {designParams.sizeVariation ?? 50}
                </label>
              </div>
              <Slider
                value={[designParams.sizeVariation ?? 50]}
                onValueChange={([value]) => setDesignParams({ ...designParams, sizeVariation: value })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Size differences between elements</p>
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RotateCw className="h-4 w-4 text-primary" />
                <label className="text-xs font-body font-medium text-foreground">
                  Rotation: {designParams.rotation ?? 0}°
                </label>
              </div>
              <Slider
                value={[designParams.rotation ?? 0]}
                onValueChange={([value]) => setDesignParams({ ...designParams, rotation: value })}
                min={0}
                max={360}
                step={15}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Rotate elements</p>
            </div>

            {/* Pattern Density */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-primary" />
                <label className="text-xs font-body font-medium text-foreground">
                  Pattern Density: {designParams.patternDensity ?? 50}
                </label>
              </div>
              <Slider
                value={[designParams.patternDensity ?? 50]}
                onValueChange={([value]) => setDesignParams({ ...designParams, patternDensity: value })}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-[10px] text-muted-foreground">Spacing & density of patterns</p>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={() => setDesignParams({})}
                className="px-4 py-2 text-sm font-medium font-body rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlBar;
