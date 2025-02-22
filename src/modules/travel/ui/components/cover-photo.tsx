import BlurImage from "@/components/blur-image";
import VectorCombined from "@/components/vector-combined";
import { CitySet } from "@/db/schema/photos";
import { trpc } from "@/trpc/client";

interface CoverPhotoProps {
  citySet: CitySet;
}

export const CoverPhoto = ({ citySet }: CoverPhotoProps) => {
  const [coverPhoto] = trpc.photos.getOne.useSuspenseQuery({
    id: citySet.coverPhotoId!,
  });

  return (
    <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
      <div className="w-full h-full relative rounded-xl overflow-hidden">
        {/* Cover photo */}
        <div className="relative w-full h-full">
          <BlurImage
            src={coverPhoto.url}
            alt={citySet.city}
            fill
            priority
            blurhash={coverPhoto.blurData}
            sizes="75vw"
            className="object-cover"
          />
        </div>

        <div className="absolute right-0 bottom-0 z-10">
          <VectorCombined title={citySet.city || ""} position="bottom-right" />
        </div>
      </div>
    </div>
  );
};
