"use client";

import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryModalProps {
  images: string[];
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  initialIndex?: number;
  alt?: string;
}

export function ImageGalleryModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  alt = "Gallery image",
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Reset state when modal opens/closes or images change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
      setImageError(false);
    }
  }, [isOpen, initialIndex, images]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLoading(true);
      setImageError(false);
    }
  }, [currentIndex, images.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsLoading(true);
      setImageError(false);
    }
  }, [currentIndex]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
        setIsLoading(true);
        setImageError(false);
      }
    },
    [images.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;
        case "Escape":
          event.preventDefault();
          onClose(false);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  if (!images.length) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;
  console.log({ isOpen }, "child");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0">
        <DialogTitle className="sr-only">
          Image gallery - {currentIndex + 1} of {images.length}
        </DialogTitle>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute cursor-pointer top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
          onClick={() => {
            onClose(false);
          }}
          aria-label="Close gallery"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Main image container */}
        <div className="relative flex items-center justify-center h-full w-full">
          {/* Previous button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-4 z-40 text-white hover:bg-white/20 rounded-full h-12 w-12",
              !hasPrevious && "opacity-50 cursor-not-allowed"
            )}
            onClick={goToPrevious}
            disabled={!hasPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Image */}
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}

            {imageError ? (
              <div className="flex flex-col items-center justify-center text-white p-8">
                <div className="text-lg font-medium mb-2">
                  Failed to load image
                </div>
                <div className="text-sm text-white/70">
                  The image could not be displayed
                </div>
              </div>
            ) : (
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={`${alt} ${currentIndex + 1}`}
                width={1200}
                height={800}
                className={cn(
                  "max-w-full max-h-full object-contain transition-opacity duration-200",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority
              />
            )}
          </div>

          {/* Next button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-4 z-40 text-white hover:bg-white/20 rounded-full h-12 w-12",
              !hasNext && "opacity-50 cursor-not-allowed"
            )}
            onClick={goToNext}
            disabled={!hasNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Thumbnail navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-md overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all",
                    index === currentIndex
                      ? "border-white scale-110"
                      : "border-white/30 hover:border-white/60"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
