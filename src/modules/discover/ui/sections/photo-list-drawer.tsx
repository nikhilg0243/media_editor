"use client";

import BlurImage from "@/components/blur-image";
import { Photo } from "@/db/schema/photos";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useMap } from "react-map-gl";
import type { RenderImageContext, RenderImageProps } from "react-photo-album";
import PhotoAlbum from "react-photo-album";
import "react-photo-album/styles.css";

interface CustomPhotoType {
  src: string;
  width: number;
  height: number;
  alt: string;
  key: string;
  customData: {
    blurHash: string;
    latitude: number;
    longitude: number;
  };
}

interface PhotoListDrawerProps {
  photos: Photo[];
  className?: string;
}

export const PhotoListDrawer = ({
  photos,
  className,
}: PhotoListDrawerProps) => {
  const { discoverMap } = useMap();
  const [isOpen, setIsOpen] = useState(false);

  const photoAlbumPhotos = useMemo(() => {
    return (
      photos?.map((photo) => ({
        src: photo.url,
        width: photo.width || 800,
        height: photo.height || 600,
        alt: photo.title,
        key: photo.id,
        customData: {
          blurHash: photo.blurData,
          latitude: photo.latitude,
          longitude: photo.longitude,
        },
      })) || []
    );
  }, [photos]);

  const renderNextImage = (
    { sizes }: RenderImageProps,
    { photo, width, height }: RenderImageContext
  ) => {
    const customPhoto = photo as unknown as CustomPhotoType;

    return (
      <div
        className="relative bg-background/60 group cursor-pointer"
        onClick={() =>
          handleClick({
            latitude: customPhoto.customData.latitude,
            longitude: customPhoto.customData.longitude,
          })
        }
        style={{
          width: "100%",
          position: "relative",
          aspectRatio: `${width} / ${height}`,
        }}
      >
        <BlurImage
          fill
          src={customPhoto.src}
          alt={customPhoto.alt}
          sizes={sizes}
          blurhash={customPhoto.customData.blurHash}
          quality={75}
          priority
        />
      </div>
    );
  };

  const handleClick = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    discoverMap?.flyTo({
      center: [longitude, latitude],
      zoom: 16,
    });
  };

  return (
    <div
      className={cn(
        "fixed -right-10 top-20 h-[calc(100vh-5rem)] transition-transform duration-300 z-50",
        isOpen ? "translate-x-0" : "translate-x-[calc(100%-2.5rem)]",
        className
      )}
    >
      {/* Handle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="absolute left-0 top-4 -translate-x-full flex items-center cursor-pointer group"
      >
        <div className="rounded-l-md bg-background border border-r-0 border-border px-2 py-3 shadow-lg">
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              !isOpen ? "rotate-180" : "",
              "group-hover:scale-110"
            )}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full w-[400px] bg-background/80 backdrop-blur-sm border-l border-border shadow-lg overflow-hidden">
        <div className="h-full w-full overflow-y-auto pr-4">
          <div className="space-y-4 p-4">
            <h2 className="text-xl font-semibold">Photos</h2>
            {/* Photo Album */}
            <PhotoAlbum
              photos={photoAlbumPhotos}
              layout="masonry"
              spacing={4}
              columns={2}
              render={{ image: renderNextImage }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
