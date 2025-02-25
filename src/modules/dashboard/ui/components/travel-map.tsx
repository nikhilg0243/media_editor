import Mapbox, { MapboxProps } from "@/components/map";
import { Photo } from "@/db/schema/photos";
import { Blurhash } from "react-blurhash";

interface TravelMapProps {
  data: {
    coverPhoto: Photo;
    photos: Photo[];
  };
}

export const TravelMap = ({ data }: TravelMapProps) => {
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
            <div className="size-5 rounded-full overflow-hidden bg-background/20 ring-1 ring-white/20">
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
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/6 bg-gradient-to-b from-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/6 bg-gradient-to-t from-background" />
    </div>
  );
};
