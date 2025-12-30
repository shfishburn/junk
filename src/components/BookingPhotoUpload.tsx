import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2, Camera, Image as ImageIcon } from "lucide-react";

interface BookingPhotoUploadProps {
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export function BookingPhotoUpload({ onPhotosChange, maxPhotos = 10 }: BookingPhotoUploadProps) {
  const [photos, setPhotos] = useState<{ file: File; preview: string; url?: string; uploading?: boolean }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('booking-photos')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('booking-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const validFiles: File[] = [];
    const currentCount = photos.length;
    const remainingSlots = maxPhotos - currentCount;

    if (remainingSlots <= 0) {
      toast({
        title: "Maximum photos reached",
        description: `You can only upload up to ${maxPhotos} photos.`,
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Create previews and start uploading
    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));

    setPhotos(prev => [...prev, ...newPhotos]);

    // Upload each file
    const uploadedUrls: string[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const url = await uploadPhoto(validFiles[i]);
      if (url) {
        uploadedUrls.push(url);
        setPhotos(prev => prev.map((p, idx) => {
          if (idx === currentCount + i) {
            return { ...p, url, uploading: false };
          }
          return p;
        }));
      } else {
        // Remove failed upload
        setPhotos(prev => prev.filter((_, idx) => idx !== currentCount + i));
        toast({
          title: "Upload failed",
          description: `Failed to upload ${validFiles[i].name}`,
          variant: "destructive",
        });
      }
    }

    // Update parent with all URLs
    const allUrls = [...photos.filter(p => p.url).map(p => p.url!), ...uploadedUrls];
    onPhotosChange(allUrls);
  }, [photos, maxPhotos, toast, onPhotosChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onPhotosChange(updated.filter(p => p.url).map(p => p.url!));
      return updated;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Camera className="h-4 w-4" />
        <span>Upload photos of items to remove (optional, up to {maxPhotos})</span>
      </div>

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={photo.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {photo.uploading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
              {!photo.uploading && (
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {photos.length < maxPhotos && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50 hover:bg-muted/50"
            }
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('photo-upload')?.click()}
        >
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-muted rounded-full">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {photos.length > 0 
                ? `Add more photos (${photos.length}/${maxPhotos})`
                : "Drop photos here or tap to upload"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
