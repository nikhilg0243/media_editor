import { CityView } from "@/modules/travel/ui/views/city-view";
import { HydrateClient, trpc } from "@/trpc/server";

type Params = Promise<{ cityName: string }>;

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { cityName } = await params;
  return {
    title: `${decodeURIComponent(cityName)} - Travel`,
  };
};

const CityPage = async ({ params }: { params: Params }) => {
  const { cityName } = await params;
  void trpc.photos.getCitySetByCity.prefetch({ city: cityName });

  return (
    <HydrateClient>
      <CityView city={cityName} />
    </HydrateClient>
  );
};

export default CityPage;
