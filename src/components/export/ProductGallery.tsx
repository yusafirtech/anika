"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const galleryImages = images && images.length > 0 ? images : ["/images/story-seafood-closeup.jpg"];
  const total = galleryImages.length;
  const currentImage = galleryImages[selectedIndex];

  const nextImage = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevImage = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const selectImage = useCallback(
    (index: number) => {
      setDirection(index >= selectedIndex ? 1 : -1);
      setSelectedIndex(index);
    },
    [selectedIndex]
  );

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Stage */}
      <div className="group relative h-[42vh] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-md md:h-[54vh]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <Image
              src={currentImage}
              alt={`${productName} — view ${selectedIndex + 1}`}
              fill
              priority
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy-deeper/10 transition-colors group-hover:bg-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Counter Badge */}
        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-navy-deeper/75 px-3 py-1 text-[11px] font-semibold tracking-wider text-white backdrop-blur-md">
          {String(selectedIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        {/* Zoom / Fullscreen Button */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-navy-deeper/70 text-white backdrop-blur-md transition-transform hover:scale-105 hover:bg-navy-deeper"
          aria-label="View fullscreen gallery"
          title="Fullscreen Gallery"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
            />
          </svg>
        </button>

        {/* Prev / Next Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-navy-deeper/65 text-white backdrop-blur-md opacity-80 hover:opacity-100 transition-all hover:scale-105"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-navy-deeper/65 text-white backdrop-blur-md opacity-80 hover:opacity-100 transition-all hover:scale-105"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Interactive Thumbnail Strip */}
      {total > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5">
          {galleryImages.map((img, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <button
                key={img + idx}
                onClick={() => selectImage(idx)}
                className={`relative h-18 w-22 shrink-0 overflow-hidden rounded-xl transition-all ${
                  isActive
                    ? "ring-2 ring-navy ring-offset-2 scale-[1.03] shadow-md opacity-100"
                    : "opacity-60 hover:opacity-100 hover:scale-[1.01]"
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="90px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
            aria-label="Close fullscreen view"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Lightbox Main Image */}
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={currentImage}
                  alt={`${productName} fullscreen view ${selectedIndex + 1}`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next controls in lightbox */}
            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute -left-4 sm:left-2 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
                  aria-label="Previous image"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute -right-4 sm:right-2 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-colors"
                  aria-label="Next image"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Bottom thumbnail row in lightbox */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={`lightbox-thumb-${idx}`}
                  onClick={() => selectImage(idx)}
                  className={`h-12 w-14 overflow-hidden rounded-lg transition-all ${
                    idx === selectedIndex
                      ? "ring-2 ring-white scale-110 opacity-100"
                      : "opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    width={56}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
