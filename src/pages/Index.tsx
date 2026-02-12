import React, { useState } from "react";
import ControlBar from "@/components/ControlBar";
import IconCanvas from "@/components/IconCanvas";
import DevicePreview from "@/components/DevicePreview";
import SizeGrid from "@/components/SizeGrid";
import SpecsPanel from "@/components/SpecsPanel";

const Index = () => {
  const [appName, setAppName] = useState("Aura");
  const [variant, setVariant] = useState<"logo" | "name">("logo");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [platform, setPlatform] = useState<"ios" | "android">("ios");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg glass-icon flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-lg text-foreground tracking-tight">
              Icon Studio
            </h1>
          </div>
          <span className="text-xs font-body text-muted-foreground">
            iOS & Android Icon Designer
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Controls */}
        <ControlBar
          appName={appName}
          setAppName={setAppName}
          variant={variant}
          setVariant={setVariant}
          mode={mode}
          setMode={setMode}
          platform={platform}
          setPlatform={setPlatform}
        />

        {/* Main preview area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Large icon preview */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6">
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center gap-5 w-full">
              <h2 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
                {variant === "logo" ? "Logo" : "Name"} · {mode === "light" ? "Light" : "Dark"}
              </h2>
              <div className="icon-glow">
                <IconCanvas
                  appName={appName}
                  variant={variant}
                  mode={mode}
                  size={180}
                  borderRadius={platform === "ios" ? "22.37%" : "50%"}
                />
              </div>
              <p className="text-sm font-body font-medium text-foreground">{appName}</p>
              <p className="text-xs text-muted-foreground font-body">
                {platform === "ios" ? "iOS Squircle" : "Android Circle"} Mask
              </p>
            </div>

            {/* Both modes side by side */}
            <div className="glass-panel rounded-2xl p-5 w-full">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">
                Mode Comparison
              </h3>
              <div className="flex justify-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  <IconCanvas
                    appName={appName}
                    variant={variant}
                    mode="light"
                    size={80}
                    borderRadius={platform === "ios" ? "22.37%" : "50%"}
                  />
                  <span className="text-[10px] text-muted-foreground font-body">Light</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <IconCanvas
                    appName={appName}
                    variant={variant}
                    mode="dark"
                    size={80}
                    borderRadius={platform === "ios" ? "22.37%" : "50%"}
                  />
                  <span className="text-[10px] text-muted-foreground font-body">Dark</span>
                </div>
              </div>
            </div>

            <SpecsPanel platform={platform} mode={mode} />
          </div>

          {/* Device preview */}
          <div className="lg:col-span-1 flex flex-col items-center gap-4">
            <h2 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
              Home Screen Preview
            </h2>
            <DevicePreview
              appName={appName}
              variant={variant}
              mode={mode}
              platform={platform}
            />
          </div>

          {/* Size grid & variant grid */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Export Sizes — {platform === "ios" ? "iOS" : "Android"}
              </h3>
              <SizeGrid
                appName={appName}
                variant={variant}
                mode={mode}
                platform={platform}
              />
            </div>

            {/* All 4 variants grid */}
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-4">
                All Variants
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["logo", "name"] as const).map((v) =>
                  (["light", "dark"] as const).map((m) => (
                    <div key={`${v}-${m}`} className="flex flex-col items-center gap-2">
                      <div
                        className="rounded-xl p-3 flex items-center justify-center"
                        style={{
                          background: m === "light"
                            ? "hsl(220 16% 95%)"
                            : "hsl(225 25% 12%)",
                        }}
                      >
                        <IconCanvas
                          appName={appName}
                          variant={v}
                          mode={m}
                          size={64}
                          borderRadius={platform === "ios" ? "22.37%" : "50%"}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-body capitalize">
                        {v} · {m}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Accessibility info */}
            <div className="glass-panel rounded-2xl p-5">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-3">
                ✅ Accessibility Checks
              </h3>
              <ul className="space-y-2 text-xs font-body text-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  Contrast ratio ≥ 4.5:1
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  Legible at 29px
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  Strong silhouette
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                  No red/green only differentiation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
