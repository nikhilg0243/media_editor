"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Mapbox, { MapboxProps } from "@/components/map";
import { trpc } from "@/trpc/client";
import BlurImage from "@/components/blur-image";
import { Blurhash } from "react-blurhash";

export const TravelMap = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <TravelMapSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const TravelMapSuspense = () => {
  const [data] = trpc.travel.getLatestTravel.useSuspenseQuery();

  const initialMarker = {
    longitude: data.coverPhoto.longitude ?? -122.4,
    latitude: data.coverPhoto.latitude ?? 37.74,
  };

  const markers: MapboxProps["markers"] =
    data.photos
      .filter(
        (
          photo
        ): photo is typeof photo & { longitude: number; latitude: number } =>
          photo.longitude !== null && photo.latitude !== null
      )
      .map((photo) => ({
        id: photo.id,
        longitude: photo.longitude,
        latitude: photo.latitude,
        element: (
          <div className="relative group cursor-pointer -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full overflow-hidden bg-background/20 ring-1 ring-white/20">
              <div
                className="w-full h-full"
                style={{ transform: "scale(1.2)" }}
              >
                <Blurhash
                  hash={photo.blurData}
                  width={12}
                  height={12}
                  punch={1}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                />
              </div>
            </div>
          </div>
        ),
        popupContent: (
          <div className="group/popup">
            <div className="relative">
              <BlurImage
                src={photo.url}
                alt={photo.title}
                width={500}
                height={500}
                quality={75}
                priority
                blurhash={photo.blurData}
                className="cursor-pointer"
              />
            </div>
          </div>
        ),
      })) || [];

  return (
    <div className="size-full relative overflow-hidden">
      <Mapbox
        markers={markers}
        initialViewState={{
          ...initialMarker,
          zoom: 11,
        }}
      />

      {/* Gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-muted" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-muted" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-muted" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-muted" />
    </div>
  );
};
