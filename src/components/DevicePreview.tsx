import React from "react";
import IconCanvas from "./IconCanvas";

interface DevicePreviewProps {
  appName: string;
  variant: "logo" | "name";
  mode: "light" | "dark";
  platform: "ios" | "android";
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ appName, variant, mode, platform }) => {
  const isLight = mode === "light";
  const isIOS = platform === "ios";

  return (
    <div
      className="relative rounded-[2rem] overflow-hidden border-2 flex flex-col items-center"
      style={{
        width: 220,
        height: 420,
        background: isLight
          ? "linear-gradient(180deg, hsl(220 16% 97%), hsl(220 14% 93%))"
          : "linear-gradient(180deg, hsl(225 25% 10%), hsl(225 20% 8%))",
        borderColor: isLight ? "hsl(220 14% 85%)" : "hsl(225 16% 20%)",
      }}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center w-full px-6 pt-3 pb-1">
        <span style={{ fontSize: 10, color: isLight ? "hsl(220 20% 20%)" : "hsl(220 14% 85%)" }} className="font-body font-medium">
          9:41
        </span>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 4, height: 4,
                background: isLight ? "hsl(220 20% 30%)" : "hsl(220 14% 70%)",
              }}
            />
          ))}
        </div>
      </div>

      {/* App grid */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Placeholder icons */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className="rounded-2xl"
                style={{
                  width: 48, height: 48,
                  background: isLight
                    ? `hsl(${200 + i * 30} 30% 85%)`
                    : `hsl(${200 + i * 30} 20% 25%)`,
                }}
              />
              <span style={{ fontSize: 8, color: isLight ? "hsl(220 20% 30%)" : "hsl(220 14% 80%)" }} className="font-body">
                App
              </span>
            </div>
          ))}

          {/* Our icon */}
          <div className="flex flex-col items-center gap-1.5">
            <IconCanvas
              appName={appName}
              variant={variant}
              mode={mode}
              size={48}
              borderRadius={isIOS ? "22.37%" : isIOS ? "22.37%" : "50%"}
            />
            <span
              style={{ fontSize: 8, color: isLight ? "hsl(220 20% 30%)" : "hsl(220 14% 80%)" }}
              className="font-body font-medium truncate max-w-[52px]"
            >
              {appName}
            </span>
          </div>
        </div>
      </div>

      {/* Dock */}
      <div
        className="w-full flex justify-center gap-4 py-4 px-6"
        style={{
          background: isLight
            ? "hsl(0 0% 100% / 0.5)"
            : "hsl(0 0% 0% / 0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl"
            style={{
              width: 40, height: 40,
              background: isLight
                ? `hsl(${120 + i * 60} 40% 70%)`
                : `hsl(${120 + i * 60} 30% 30%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DevicePreview;
