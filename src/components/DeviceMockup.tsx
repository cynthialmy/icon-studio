import React, { useId } from "react";

interface DeviceMockupProps {
  imageUrl: string;
  deviceType: "iphone" | "ipad" | "android";
  frameStyle?: "minimal" | "elegant" | "bold";
  className?: string;
  width?: number;
  height?: number;
}

const DeviceMockup: React.FC<DeviceMockupProps> = ({
  imageUrl,
  deviceType,
  frameStyle = "elegant",
  className = "",
  width = 375,
  height = 812,
}) => {
  const uniqueId = useId();
  const frameWidth = deviceType === "ipad" ? 768 : width;
  const frameHeight = deviceType === "ipad" ? 1024 : height;
  const bezelWidth = deviceType === "ipad" ? 20 : 12;
  const cornerRadius = deviceType === "iphone" ? 40 : deviceType === "ipad" ? 20 : 30;

  const shadowIntensity = frameStyle === "bold" ? 0.4 : frameStyle === "elegant" ? 0.25 : 0.15;
  const borderWidth = frameStyle === "bold" ? 3 : frameStyle === "elegant" ? 2 : 1;

  return (
    <div className={`relative ${className}`} style={{ width: frameWidth + bezelWidth * 2, height: frameHeight + bezelWidth * 2 }}>
      <div
        className="relative rounded-[2rem] overflow-hidden"
        style={{
          width: frameWidth + bezelWidth * 2,
          height: frameHeight + bezelWidth * 2,
          padding: `${bezelWidth}px`,
          background: `linear-gradient(135deg, hsl(240 15% 20%), hsl(240 15% 10%))`,
          borderRadius: `${cornerRadius + bezelWidth}px`,
          boxShadow: `0 20px 40px rgba(0, 0, 0, ${shadowIntensity}), 0 8px 16px rgba(0, 0, 0, ${shadowIntensity * 0.5})`,
        }}
      >
        <div
          className="relative w-full h-full rounded-[2rem] overflow-hidden"
          style={{
            borderRadius: `${cornerRadius}px`,
            border: `${borderWidth}px solid hsl(240 15% 30%)`,
          }}
        >
          <img
            src={imageUrl}
            alt="App screenshot"
            className="w-full h-full object-cover"
          />
          {/* Screen reflection overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceMockup;
