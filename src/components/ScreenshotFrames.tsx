import React, { useState } from "react";
import DeviceMockup from "./DeviceMockup";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { downloadImage } from "@/lib/screenshotUtils";

interface ScreenshotFramesProps {
  screenshots: File[];
}

type ViewMode = "gallery" | "devices" | "story";

const ScreenshotFrames: React.FC<ScreenshotFramesProps> = ({ screenshots }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const imageUrls = screenshots.map((file) => URL.createObjectURL(file));

  React.useEffect(() => {
    // Auto-advance story
    if (viewMode === "story" && screenshots.length > 0) {
      const interval = setInterval(() => {
        setCurrentStoryIndex((prev) => (prev + 1) % screenshots.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [viewMode, screenshots.length]);

  const handleExportFrame = async (imageUrl: string, index: number, type: string) => {
    downloadImage(imageUrl, `screenshot-${type}-${index + 1}.png`);
  };

  const handleExportAll = async () => {
    imageUrls.forEach((url, index) => {
      setTimeout(() => {
        downloadImage(url, `screenshot-${index + 1}.png`);
      }, index * 100);
    });
  };

  if (screenshots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-display font-bold text-foreground">
          Screenshot Frames
        </h3>
        <Button onClick={handleExportAll} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="devices">Device Mockups</TabsTrigger>
          <TabsTrigger value="story">Animated Story</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="group relative glass-panel-enhanced rounded-2xl overflow-hidden p-4 animate-scaleIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
                  <img
                    src={url}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleExportFrame(url, index, "gallery")}
                    className="h-8 w-8"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-foreground">Frame {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="devices" className="mt-6">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-4 animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <DeviceMockup
                    imageUrl={url}
                    deviceType={index % 3 === 0 ? "iphone" : index % 3 === 1 ? "ipad" : "android"}
                    frameStyle="elegant"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportFrame(url, index, "device")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="story" className="mt-6">
          <div className="relative">
            <div className="aspect-[9/16] max-w-md mx-auto glass-panel-enhanced rounded-3xl overflow-hidden p-8 flex items-center justify-center">
              {imageUrls.length > 0 && (
                <div className="relative w-full h-full">
                  {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentStoryIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Story frame ${index + 1}`}
                        className="w-full h-full object-contain rounded-2xl"
                      />
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {imageUrls.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentStoryIndex
                            ? "w-8 bg-primary"
                            : "w-2 bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentStoryIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentStoryIndex((prev) => (prev + 1) % screenshots.length)}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScreenshotFrames;
