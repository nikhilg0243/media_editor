import React from "react";
import { StatisticsCard } from "../components/statistics-card";

export const StatisticsSection = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatisticsCard title="Photos" value={100} />
      <StatisticsCard title="Albums" value={50} />
      <StatisticsCard title="Followers" value={500} />
      <StatisticsCard title="Likes" value={1000} />
    </div>
  );
};
