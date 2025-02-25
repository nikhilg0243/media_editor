"use client";

import { StatisticsCard } from "../components/statistics-card";
import { trpc } from "@/trpc/client";

export const StatisticsSection = () => {
  const [summary] = trpc.summary.getSummary.useSuspenseQuery();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatisticsCard title="Photos" value={summary.data?.photoCount || 0} />
      <StatisticsCard
        title="Travel Cities"
        value={summary.data?.cityCount || 0}
      />
      <StatisticsCard title="Followers" value={500} />
      <StatisticsCard title="Likes" value={1000} />
    </div>
  );
};
