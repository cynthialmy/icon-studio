import React, { useState, useMemo } from "react";
import ControlBar from "@/components/ControlBar";
import IconCanvas, { getIconSvgString } from "@/components/IconCanvas";
import DevicePreview from "@/components/DevicePreview";
import SizeGrid from "@/components/SizeGrid";
import SpecsPanel from "@/components/SpecsPanel";
import WaitlistForm from "@/components/WaitlistForm";
import ScreenshotGenerator from "@/components/ScreenshotGenerator";
import { generateDesignSpec, DesignParams } from "@/lib/designGenerator";
import { buildExportZip, downloadBlob } from "@/lib/exportUtils";

const Index = () => {
  const [appName, setAppName] = useState("Aura");
  const [variant, setVariant] = useState<"logo" | "name">("logo");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [waitlistScreenshots, setWaitlistScreenshots] = useState<File[]>([]);
  const [designParams, setDesignParams] = useState<DesignParams>({});

  // Generate design spec when app name or design params change
  const designSpec = useMemo(() => generateDesignSpec(appName, designParams), [appName, designParams]);

  const handleScreenshotUpload = (files: File[]) => {
    setWaitlistScreenshots(files);
  };

  // Export handler
  const handleExport = async () => {
    const borderRadius = platform === "ios" ? "22.37%" : "50%";

    const svgGenerator = (size: number, variant: "logo" | "name", mode: "light" | "dark") => {
      return getIconSvgString(appName, variant, mode, size, borderRadius, designSpec);
    };

    const zipBlob = await buildExportZip(svgGenerator, appName, platform);
    const filename = `${appName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-icons.zip`;
    downloadBlob(zipBlob, filename);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass-icon flex items-center justify-center animate-scaleIn">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="headerIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(262 83% 70%)" />
                    <stop offset="100%" stopColor="hsl(280 70% 75%)" />
                  </linearGradient>
                </defs>
                <g transform="translate(50, 50)">
                  <rect x="-18" y="-18" width="36" height="36" rx="8" fill="none" stroke="url(#headerIconGrad)" strokeWidth="4" opacity="0.9" />
                  <circle cx="0" cy="0" r="8" fill="url(#headerIconGrad)" opacity="0.95" />
                  <rect x="-6" y="-18" width="12" height="12" rx="2" fill="url(#headerIconGrad)" opacity="0.6" />
                </g>
              </svg>
            </div>
            <h1 className="font-display font-bold text-xl text-foreground tracking-tight">
              Icon Studio
            </h1>
          </div>
          <span className="text-sm font-body text-muted-foreground hidden md:block">
            iOS & Android Icon Designer
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-16 animate-fadeInUp">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight">
              Create Unique
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                App Icons
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-body">
              Generate beautiful, algorithmic app icons from your app name. Export production-ready assets for iOS and Android.
            </p>
          </div>

          {/* Hero Icon Showcase */}
          <div className="flex justify-center items-center mb-16 animate-fadeInUp stagger-2">
            <div className="relative">
              <div className="icon-glow">
                <IconCanvas
                  appName={appName}
                  variant={variant}
                  mode={mode}
                  size={240}
                  borderRadius={platform === "ios" ? "22.37%" : "50%"}
                  designSpec={designSpec}
                />
              </div>
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse-glow" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-16">
        {/* Controls */}
        <div className="animate-fadeInUp stagger-1">
          <ControlBar
            appName={appName}
            setAppName={setAppName}
            variant={variant}
            setVariant={setVariant}
            mode={mode}
            setMode={setMode}
            platform={platform}
            setPlatform={setPlatform}
            designParams={designParams}
            setDesignParams={setDesignParams}
            onExport={handleExport}
          />
        </div>

        {/* Main preview area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Large icon preview */}
          <div className="lg:col-span-1 flex flex-col items-center gap-6 animate-fadeInUp stagger-2">
            <div className="glass-panel-enhanced rounded-3xl p-8 flex flex-col items-center gap-5 w-full hover:scale-[1.02] transition-transform duration-300">
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
                  designSpec={designSpec}
                />
              </div>
              <p className="text-sm font-body font-medium text-foreground">{appName}</p>
              <p className="text-xs text-muted-foreground font-body">
                {platform === "ios" ? "iOS Squircle" : "Android Circle"} Mask
              </p>
            </div>

            {/* Both modes side by side */}
            <div className="glass-panel-enhanced rounded-2xl p-5 w-full">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-4 text-center">
                Mode Comparison
              </h3>
              <div className="flex justify-center gap-6">
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <IconCanvas
                      appName={appName}
                      variant={variant}
                      mode="light"
                      size={80}
                      borderRadius={platform === "ios" ? "22.37%" : "50%"}
                      designSpec={designSpec}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-body">Light</span>
                </div>
                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="group-hover:scale-110 transition-transform duration-300">
                    <IconCanvas
                      appName={appName}
                      variant={variant}
                      mode="dark"
                      size={80}
                      borderRadius={platform === "ios" ? "22.37%" : "50%"}
                      designSpec={designSpec}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-body">Dark</span>
                </div>
              </div>
            </div>

            <SpecsPanel platform={platform} mode={mode} />
          </div>

          {/* Device preview */}
          <div className="lg:col-span-1 flex flex-col items-center gap-4 animate-fadeInUp stagger-3">
            <h2 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider">
              Home Screen Preview
            </h2>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <DevicePreview
                appName={appName}
                variant={variant}
                mode={mode}
                platform={platform}
                designSpec={designSpec}
              />
            </div>
          </div>

          {/* Size grid & variant grid */}
          <div className="lg:col-span-1 flex flex-col gap-6 animate-fadeInUp stagger-4">
            <div className="glass-panel-enhanced rounded-2xl p-5">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Export Sizes — {platform === "ios" ? "iOS" : "Android"}
              </h3>
            <SizeGrid
              appName={appName}
              variant={variant}
              mode={mode}
              platform={platform}
              designSpec={designSpec}
            />
            </div>

            {/* All 4 variants grid */}
            <div className="glass-panel-enhanced rounded-2xl p-5">
              <h3 className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-4">
                All Variants
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {(["logo", "name"] as const).map((v) =>
                  (["light", "dark"] as const).map((m) => (
                    <div key={`${v}-${m}`} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div
                        className="rounded-xl p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{
                          background: m === "light"
                            ? "hsl(240 15% 12%)"
                            : "hsl(240 15% 8%)",
                        }}
                      >
                        <IconCanvas
                          appName={appName}
                          variant={v}
                          mode={m}
                          size={64}
                          borderRadius={platform === "ios" ? "22.37%" : "50%"}
                          designSpec={designSpec}
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
            <div className="glass-panel-enhanced rounded-2xl p-5">
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

        {/* Waitlist Section */}
        <section id="waitlist" className="space-y-12 py-16">
          <div className="text-center space-y-4 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Join the Waitlist
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be among the first to access our app store screenshot generator. Transform your screenshots into stunning presentations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fadeInUp stagger-1">
              <WaitlistForm onScreenshotUpload={handleScreenshotUpload} />
            </div>
            <div className="animate-fadeInUp stagger-2">
              <ScreenshotGenerator
                initialScreenshots={waitlistScreenshots}
                onScreenshotsChange={setWaitlistScreenshots}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
