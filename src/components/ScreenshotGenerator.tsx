import React, { useState } from "react";
import ScreenshotFrames from "./ScreenshotFrames";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ScreenshotGeneratorProps {
  initialScreenshots?: File[];
  onScreenshotsChange?: (files: File[]) => void;
}

const ScreenshotGenerator: React.FC<ScreenshotGeneratorProps> = ({
  initialScreenshots = [],
  onScreenshotsChange,
}) => {
  const [screenshots, setScreenshots] = useState<File[]>(initialScreenshots);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      const newScreenshots = [...screenshots, ...imageFiles];
      setScreenshots(newScreenshots);
      onScreenshotsChange?.(newScreenshots);
      toast.success(`Added ${imageFiles.length} screenshot(s)`);
    } else {
      toast.error("Please upload image files only");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const removeScreenshot = (index: number) => {
    const newScreenshots = screenshots.filter((_, i) => i !== index);
    setScreenshots(newScreenshots);
    onScreenshotsChange?.(newScreenshots);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel-enhanced rounded-3xl p-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-2">
              Upload Screenshots
            </h3>
            <p className="text-muted-foreground">
              Upload your app screenshots to transform them into beautiful app store presentations
            </p>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-2xl p-12 transition-all ${
              isDragging
                ? "border-primary bg-primary/10 scale-105"
                : "border-border/50 bg-background/30 hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="screenshot-upload"
            />
            <label
              htmlFor="screenshot-upload"
              className="flex flex-col items-center justify-center cursor-pointer space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-foreground">
                  {isDragging ? "Drop your screenshots here" : "Drag & drop screenshots"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse • PNG, JPG up to 10MB each
                </p>
              </div>
            </label>
          </div>

          {screenshots.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-foreground">
                  {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""} uploaded
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setScreenshots([]);
                    onScreenshotsChange?.([]);
                  }}
                >
                  Clear All
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {screenshots.map((file, index) => (
                  <div key={index} className="relative group aspect-[9/16] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeScreenshot(index)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {screenshots.length > 0 && <ScreenshotFrames screenshots={screenshots} />}
    </div>
  );
};

export default ScreenshotGenerator;
