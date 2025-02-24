import { TravelMap } from "../components/travel-map";
import { TravelPhotos } from "../components/travel-photos";

export const TravelSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-[500px] border">
      <TravelPhotos />
      <TravelMap />
    </div>
  );
};
