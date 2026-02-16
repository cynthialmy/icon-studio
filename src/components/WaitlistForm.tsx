import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { Mail, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistFormProps {
  onScreenshotUpload?: (files: File[]) => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ onScreenshotUpload }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
  });

  const [screenshots, setScreenshots] = useState<File[]>([]);

  const submitWaitlist = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      // EmailJS configuration - get from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const recipientEmail = import.meta.env.VITE_RECIPIENT_EMAIL || "apecyncyn@gmail.com";

      // If EmailJS is not configured, fall back to console log
      if (!serviceId || !templateId || !publicKey) {
        console.log("Waitlist signup (EmailJS not configured):", data);
        // Simulate delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { success: true, email: data.email };
      }

      // Send email using EmailJS
      const templateParams = {
        user_email: data.email,
        to_email: recipientEmail,
        message: `New waitlist signup from: ${data.email}`,
        reply_to: data.email,
      };

      try {
        await emailjs.send(serviceId, templateId, templateParams, {
          publicKey: publicKey,
        });
        return { success: true, email: data.email };
      } catch (error) {
        console.error("EmailJS error:", error);
        throw new Error("Failed to send email. Please try again.");
      }
    },
    onSuccess: () => {
      toast.success("Successfully joined the waitlist! We'll be in touch soon.");
      reset();
      setScreenshots([]);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to join waitlist. Please try again.");
    },
  });

  const onSubmit = async (data: WaitlistFormData) => {
    // If screenshots are uploaded, pass them to parent
    if (screenshots.length > 0 && onScreenshotUpload) {
      onScreenshotUpload(screenshots);
    }
    await submitWaitlist.mutateAsync(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setScreenshots((prev) => [...prev, ...imageFiles]);
      toast.success(`Added ${imageFiles.length} screenshot(s)`);
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="glass-panel-enhanced rounded-3xl p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-foreground">
          Join the Waitlist
        </h2>
        <p className="text-muted-foreground font-body">
          Be among the first to access our app store screenshot generator. Transform your screenshots into stunning app store presentations.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshots" className="text-sm font-medium">
            Upload App Screenshots (Optional)
          </Label>
          <div className="border-2 border-dashed border-border/50 rounded-xl p-6 bg-background/30 hover:border-primary/50 transition-colors">
            <input
              id="screenshots"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="screenshots"
              className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB each
              </span>
            </label>
          </div>

          {screenshots.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {screenshots.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden aspect-[9/16] bg-muted"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitWaitlist.isPending}
          className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium shadow-lg shadow-primary/25"
        >
          {submitWaitlist.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </form>
    </div>
  );
};

export default WaitlistForm;
