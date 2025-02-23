import { ChartsSection } from "../sections/charts-section";
import { StatisticsSection } from "../sections/statistics-section";

export const DashboardView = () => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5 px-4">
      <StatisticsSection />
      <ChartsSection />
    </div>
  );
};
